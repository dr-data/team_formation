from __future__ import division
__author__ = 'sivanov'
import random, sys,optparse
from itertools import cycle


def get_players(in_f):
    '''
    Retrieve players from the file
    Each line is: Name Pref.1 Pref.2 Pref.3 Type
    All are separated by single space
    :param in_f:
    :return:
    '''
    players = dict()
    with open(in_f) as f:
        next(f)
        for line in f:
            d = line.strip().split(',')
            players[d[1]] = d[2:]
    return players

def assign_tasks_to_teams(teams_tasks, tasks):
    count = 0
    T = len(teams_tasks)
    for task in cycle(tasks):
        teams_tasks[count] = task
        count += 1
        if count > T:
            break
    return teams_tasks

def get_prefered_tasks(players):
    tasks = set() # all tasks that were specified
    for pref in players.values():
        tasks.update(pref[0:3])
    tasks = list(tasks)
    random.shuffle(tasks)
    return tasks

def select_player(names, players):
    name = random.choice(names)
    p1 = players[name][0]
    p2 = players[name][1]
    p3 = players[name][2]
    return name, p1, p2, p3


def same_class(team, cl, players):
    for pl in team:
        if cl == players[pl][-1]:
            return True
    return False

def print_teams(teams, teams_tasks, players):
    print 'Team\tName\tSkills\tPref.1\tPref.2'
    for t in sorted(teams, key=lambda dk: teams_tasks[dk]):
        for name in teams[t]:
            print '%s\t%s\t%s\t%s\t%s' %(teams_tasks[t], name, players[name][-1], players[name][0], players[name][1])
        print

def get_teams(in_f, m, a=2, b=1.5, c=1, d = 0, e=-2):

    # INITIALIZATION
    players = get_players(in_f)
    N = len(players)
    T = N//m + bool(N%m) # add one team if m doesn't divide N

    teams = {i: [] for i in range(T)} # team number -> [names]
    teams_tasks = {i: None for i in range(T)} # team number -> task number
    classes = dict()
    for p in players:
        skill = players[p][-1]
        classes.setdefault(skill, []).append(p)

    tasks = get_prefered_tasks(players)

    # MAIN ALGORITHM

    # Phase 1
    # Assign tasks to teams
    teams_tasks = assign_tasks_to_teams(teams_tasks, tasks)

    # Phase 2
    # Assign a player to a team
    for count, cl in enumerate(cycle(classes)):
        # Terminate if all players are assigned
        if count == N:
            break

        # choose next class
        names = classes[cl]
        if not len(names):
            continue
        # select a player
        name, p1, p2, p3 = select_player(names, players)
        names.remove(name)

        # find the best team at the current moment for the selected player
        best_choice_team = -1 # team number
        best_choice_score = float("-Inf") # score the player gets if he selects this team (the higher, the better)
        for t in teams:
            if len(teams[t]) == m: # if no space in a team move to next one
                continue

            # get score of a player for each team and select the highest
            tt = teams_tasks[t]
            score = (tt == p1)*a + (tt == p2)*b + (tt == p3)*c + (tt != p1 and tt != p2 and tt != p3)*d

            if same_class(teams[t], cl, players):
                score += e
            if score > best_choice_score:
                best_choice_score = score
                best_choice_team = t

        teams[best_choice_team].append(name)
    return teams, teams_tasks, players

if __name__ == "__main__":

    parser = optparse.OptionParser(usage='usage example: %prog [options] -f preferences.csv -m 5')
    parser.add_option('-f', '--file',
                            dest='in_f',
                            help='Input filename')
    parser.add_option('-m',
                            dest='m', type=int,
                            help='Maximum number of players per team')
    parser.add_option('-o', '--out',
                      action="store", dest="out_f",
                      help="Output filename")
    # TODO add additional optional parameters for score grades

    options, args = parser.parse_args()

    if not options.in_f:   # if filename is not given
        parser.error('Filename not given')
    in_f = options.in_f

    if not options.m:   # if filename is not given
        parser.error('Maximum number of players not given')
    m = options.m

    if options.out_f:
        out_f = options.out_f
        sys.stdout = open(out_f, "w+")

    teams, teams_tasks, players = get_teams(in_f, m)
    print_teams(teams, teams_tasks, players)



console = []

