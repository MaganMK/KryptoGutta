from backend.Bittrex import *
from backend.Binance import *

def handleInput(data):
    data = data.split("\n")
    exchange = data[0]
    if(exchange == "bittrex"):
        Bittrex(data[2:])
    elif(exchange == "binance"):
        Binance(data[2:])
    #Legger til flere exchanges her





