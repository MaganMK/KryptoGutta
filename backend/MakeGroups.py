
from backend.Bittrex import *

def handleInput(data):
    data = data.decode("utf-8")

    data = data.split("\n")


    if(data[0] == "bittrex"):
        bittrexTrans = Bittrex(data[2:])





