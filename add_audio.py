from os import listdir
from os.path import isfile, join


def check():
    files = [f for f in listdir("./") if isfile(join("./", f))
             and ".mp3" in f or ".m4a" in f]

    dicto = {}

    for i in files:
        dicto[i.split(".")[0]] = i

    return dicto
