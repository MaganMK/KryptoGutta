import requests
import calendar
import json

class Transaction:

    def __init__(self, name, quantity, date, is_sale, site):
        self.name = fix_name(name)
        self.quantity = float(quantity)
        self.is_sale = is_sale
        self.date = date
        self.unit_price = self.calculate_unit_price()
        self.total_price = float(self.quantity)*float(self.unit_price)
        self.site = site

    #Fikser rebrands (ans) og kaller bcc for bch

    def calculate_unit_price(self):
        timestamp = calendar.timegm(self.date.utctimetuple())
        req = requests.get("https://min-api.cryptocompare.com/data/pricehistorical" +
                           "?fsym=" + self.name + "&tsyms=NOK&ts=" + str(timestamp))
        res = json.loads(req.text)
        return res[self.name]["NOK"]

    def __str__(self):
        sale = "sell" if self.is_sale else "buy"
        return "Name: " + self.name + " " + sale + "  Qty: " + str(self.quantity) + "  Date: " + str(self.date) + "  Unit price: " + str(self.unit_price) + " Total price: " + str(self.total_price) + " exchange: " + self.site


def fix_name(name):
    fixes = {"ANS": "NEO", "BCC": "BCH"}
    if name in fixes.keys():
        return fixes[name]
    return name
