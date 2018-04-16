from backend.Exchanges.Exchange import Exchange
from backend.Transaction import *

class Binance(Exchange):

    def save_transactions(self, data):
        #0 date = 2018-01-07 20:42:29
        #1 market = VENBTC
        #2 type = BUY (SELL)
        #3 price (pris per enhet i btc?) = 0.0002915
        #4 amount (antall enheter av currency 1) = 34
        #5 total (totalpris i btc) = 0.009911
        #6 fee (gebyr i feecoin) = 0.034
        #7 fee coin = VEN
        transactions = []
        for line in data:
            if (len(line) > 0):
                lines = line.split(",")
                type = lines[2]
                currencies = self.get_trading_pair(lines[1])
                date = self.create_date(lines[0])
                if (type == "SELL"):
                    sell_transaction = Transaction(currencies[0], lines[4], date, True, "Binance")
                    buy_transaction = Transaction(currencies[1], lines[5], date, False, "Binance")
                else:
                    buy_transaction = Transaction(currencies[0], lines[4], date, False, "Binance")
                    sell_transaction = Transaction(currencies[1], lines[5], date, True, "Binance")
                transactions.append(sell_transaction)
                transactions.append(buy_transaction)
        return transactions

    def get_trading_pair(self, line):
        result = []
        if (len(line) == 7):
            result.append(line[:3])
            result.append(line[4:])
        else:
            result.append(line[:3])
            result.append(line[3:])
        return result

