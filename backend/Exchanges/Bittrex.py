from backend.Transaction import *
from backend.Exchanges.Exchange import Exchange

class Bittrex(Exchange):

    def save_transactions(self, data):
        #0 id = 8a9bf807 - f899 - 4c07 - 95b8 - 9d312ef1e192,\
        #1 exchange = BTC - ADA
        #2 type = LIMIT_SELL
        #3 quantity = 331
        #4 limit = 0.00006166
        #5 commision 0.00005109
        #6 price (første currency) = 0.02043925
        #7 opened = 01 / 08 / 2018 08:35
        #8 closed = 01 / 08 / 2018 08:35
        transactions = []
        for line in data:
            if (len(line) > 0):
                lines = line.split(",")
                type = lines[2]
                currencies = lines[1].split("-")
                date = self.create_date(lines[8])
                if (type == "LIMIT_SELL"):
                    buy_transaction = Transaction(currencies[0], lines[6], date, False)
                    sell_transaction = Transaction(currencies[1], lines[3], date, True)
                else:
                    sell_transaction = Transaction(currencies[0], lines[6], date, True)
                    buy_transaction = Transaction(currencies[1], lines[3], date, False)
                transactions.append(sell_transaction)
                transactions.append(buy_transaction)
        self.write_result(transactions)


    #def create_date(self, date_string):
        #return parser.parse(date_string)
        #print(date_string)
        #try:
        #    return datetime.strptime(date_string, "%m/%d/%Y %I:%M:%S %p")
        #except ValueError:
        #    return datetime.strptime(date_string, "%m/%d/%Y %H:%M")
