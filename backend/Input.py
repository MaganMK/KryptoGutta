from backend.Exchanges.Bittrex import *


def handleInput(data):
    data = data.split("\n")
    exchange = data[0]
    if exchange == "bittrex":
        bittrex = Bittrex(data[2:])
        return bittrex.trans

    #Legger til flere exchanges her