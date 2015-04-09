from __future__ import division
__author__ = 'sivanov'
import random, sys
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

def get_number_of_teams(N, m):
    '''
    Calculate the total number of teams
    :param N: total number of players
    :param m: maximum number of players per team
    :return:
    '''
    if not N%m:
        return N//m
    else:
        return N//m + 1

def assign_tasks_to_teams(teams_tasks, tasks):

    teams_tasks[0] = '2'
    teams_tasks[1] = '2'
    for i in range(2,2+5):
        teams_tasks[i] = 1
    count = 7
    T = len(teams_tasks)
    for task in cycle(tasks):
        if count > T:
            break
        if task == '2':
            continue
        teams_tasks[count] = task
        count += 1

    return teams_tasks


def get_teams(in_f, m, a=2, b=1.5, c=1, d = 0, e=-2):
    players = get_players(in_f)
    N = len(players)
    T = get_number_of_teams(N, m)
    classes = dict()
    teams = dict()
    teams_tasks = dict()
    teams_classes = dict()
    teams_first_pref = dict()
    for i in range(T):
        teams[i] = []
        teams_classes[i] = []
        teams_first_pref[i] = []
        teams_tasks[i] = None
    tasks = set()
    for pl in players:
        tasks.add(players[pl][0])
        tasks.add(players[pl][1])
        tasks.add(players[pl][2])
    tasks_lst = list(tasks)
    random.shuffle(tasks_lst)
    teams_tasks = assign_tasks_to_teams(teams_tasks, tasks_lst)

    for p in players:
        skill = players[p][-1]
        classes.setdefault(skill, []).append(p)

    count = 0
    for cl in cycle(classes):
        if count == N:
            break
        names = classes[cl]
        if not len(names):
            continue
        name = random.choice(names)
        names.remove(name)
        pref1 = players[name][0]
        pref2 = players[name][1]
        pref3 = players[name][2]
        skill = players[name][3]

        best_choice_team = -1
        best_choice_score = float("-Inf")
        for t in teams:
            if len(teams[t]) == m:
                continue
            # if not len(teams[t]):
            #     teams_tasks[t] = pref1
            #     best_choice_team = t
            #     break

            score = 0
            if teams_tasks[t] == pref1:
                score += a
                for pl in teams[t]:
                    if cl == players[pl][-1]:
                        score += e
                        break
                if score > best_choice_score:
                    best_choice_score = score
                    best_choice_team = t
            elif teams_tasks[t] == pref2:
                score += b
                for pl in teams[t]:
                    if cl == players[pl][-1]:
                        score += e
                        break
                if score > best_choice_score:
                    best_choice_score = score
                    best_choice_team = t
            elif teams_tasks[t] == pref3:
                score += c
                for pl in teams[t]:
                    if cl == players[pl][-1]:
                        score += e
                        break
                if score > best_choice_score:
                    best_choice_score = score
                    best_choice_team = t
            else:
                score += d
                for pl in teams[t]:
                    if cl == players[pl][-1]:
                        score += e
                        break
                if score > best_choice_score:
                    best_choice_score = score
                    best_choice_team = t
        teams[best_choice_team].append(name)
        teams_classes[best_choice_team].append(skill)
        teams_first_pref[best_choice_team].append(pref1)
        count += 1
    return teams, teams_classes, teams_tasks, teams_first_pref, players

def print_teams(teams, teams_tasks, players):
    print 'Team\tName\tSkills\tPref.1\tPref.2'
    for t in sorted(teams, key=lambda dk: teams_tasks[dk]):
        for name in teams[t]:
            print '%s\t%s\t%s\t%s\t%s' %(teams_tasks[t], name, players[name][-1], players[name][0], players[name][1])
        print

if __name__ == "__main__":

    T1, T2, T3, T4, players = get_teams("preferences.csv", 5)
    print T1
    print T2
    print T3
    print T4
    print_teams(T1, T3, players)

    # if len(sys.argv) < 3:
    #     print
    #     print 'Error:'
    #     print 'The input should include the file with names and upper bound on the number of people per team.'
    #     print 'Optional arguments:'
    #     print '\t -o -- name of output file'
    #     print 'Example of command: python team_formation preferences.csv 5 -o teams.txt'
    #     sys.exit(0)
    # if len(sys.argv) == 4:
    #     print
    #     print 'Error:'
    #     print 'Please provide output filename or write to console (omit -o)'
    #     print 'Example of command: python team_formation preferences.csv 5 -o teams.txt'
    #     sys.exit(0)
    #
    # if len(sys.argv) == 5 and sys.argv[3] == "-o":
    #     out_f = sys.argv[4]
    #     sys.stdout = open(out_f, "w+")
    #
    # in_f = sys.argv[1]
    # m = int(sys.argv[2])
    #
    #
    # T1, T2, T3, T4, players = get_teams(in_f, m)
    # # T1, T2, T3, T4, players = get_teams("preferences.csv", 3)
    # # print T1
    # # print T2
    # # print T3
    # # print T4
    # # print_teams(T1, T3, players)
    # print_teams(T1, T3, players)



console = []

