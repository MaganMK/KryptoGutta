import requests
import calendar
import json

class Transaction:

    def __init__(self, name, quantity, date, is_sale):
        self.name = name
        self.quantity = quantity
        self.is_sale = is_sale
        self.date = date
        self.unitPrice = self.calculate_unit_price()
        self.totalPrice = self.quantity*self.unitPrice

    def calculate_unit_price(self):
        timestamp = calendar.timegm(self.date.utctimetuple())
        req = requests.get("https://min-api.cryptocompare.com/data/pricehistorical" +
                           "?fsym=" + self.name + "&tsyms=USD&ts=" + str(timestamp))
        res = json.loads(req.text)
        return res[self.name]["USD"]
