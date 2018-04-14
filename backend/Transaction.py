import requests
import calendar
import json

class Transaction:

    def __init__(self, name, quantity, date, is_sale):
        self.name = name
        self.quantity = quantity
        self.is_sale = is_sale
        self.date = date
        self.unit_price = self.calculate_unit_price()
        self.totalPrice = float(self.quantity)*float(self.unit_price)

    def calculate_unit_price(self):
        timestamp = calendar.timegm(self.date.utctimetuple())
        req = requests.get("https://min-api.cryptocompare.com/data/pricehistorical" +
                           "?fsym=" + self.name + "&tsyms=USD&ts=" + str(timestamp))
        res = json.loads(req.text)
        return res[self.name]["USD"]

    def __str__(self):
        return "Name: " + self.name + "  Quantity: " + str(self.quantity) + "  Date: " + str(self.date) + "  is_sale: " + str(self.is_sale) + "  unit_price: " + str(self.unit_price)
