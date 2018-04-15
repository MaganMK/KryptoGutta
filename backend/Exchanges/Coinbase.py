from backend.Exchanges.Exchange import Exchange
from backend.Transaction import *

class Coinbase(Exchange):

    #OBS! Vet ikke hvordan csv ser ut ved salg

    def save_transactions(self, data):
        #0 date = 05/06/2017 10:02
        #1 balance
        #2 amount (antall enheter kjøpt av currency = 0.2262
        #3 currency = ETH
        #4 amount (antall enheter av currency 1) = 34
        #5 To
        #6 notes = Bought 0.22623156 ETH for €52.00 EUR
        #7
        #Timestamp, Balance, Amount, Currency, To, Notes, Instantly Exchanged,
        #Transfer Total, Transfer Total Currency, Transfer Fee, Transfer Fee Currency,
        #Transfer Payment Method, Transfer ID, Order Price, Order Currency, Order BTC,
        #Order Tracking Code, Order Custom Parameter, Order Paid Out, Recurring Payment ID,
        #Coinbase ID(visit https: // www.coinbase.com / transactions / [ID] in your browser), Bitcoin Hash(visit
        #https: // www.coinbase.com / tx / [HASH] in your browser for more info)

        #05/06/2017 10:02, 0.22623156, 0.22623156, ETH, 592684de2205ad0a29e923da, Bought 0.22623156 ETH for €52.00 EUR.,
        #  false, 52, EUR, 2, EUR, Visa debit ** ** ** ** 0040, 59358e83ae4b985bafce2a36, , , , , , , , 59358e8b79b72ea963dad41f,

        transactions = []
        for line in data:
            if (len(line) > 0):
                lines = line.split(",")
                #Sjekker om "transaksjonen" er en overføring, isåfall er lengden på notes 0?
                if len(lines[6]) != 0:
                    type = self.get_type(lines[6])
                    date = self.create_date(lines[0])
                    currency = lines[3]
                    if (type == "SELL"):
                        sell_transaction = Transaction(currency, abs(float(lines[2])), date, True, "coinbase")
                        transactions.append(sell_transaction)
                    else:
                        buy_transaction = Transaction(currency, abs(float(lines[2])), date, False, "coinbase")
                        transactions.append(buy_transaction)
        self.write_result(transactions)


    def get_type(self, notes):
        if "Bought" in notes:
            return "BUY"
        else:
            return "SALE"




