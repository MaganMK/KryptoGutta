from backend.Bittrex import *

def handleInput(data):
    data = data.decode("utf-8")

    data = data.split("\n")

    exchange = data[0]
    if(exchange == "bittrex"):
        Bittrex(data[2:])
    #Legger til flere exchanges her





