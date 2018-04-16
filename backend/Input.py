from backend.Exchanges.Bittrex import *
from backend.Exchanges.Binance import *
from backend.Exchanges.Coinbase import *

def handleInput(data):
    data = data.split("\n")
    exchange = data[0]
    e = None
    if exchange == "bittrex":
        e = Bittrex(data[2:])
    elif exchange == "binance":
        e = Binance(data[2:])
    elif exchange == "coinbase":
        e = Coinbase(data[6:])
    return e.trans
    #Legger til flere exchanges her





