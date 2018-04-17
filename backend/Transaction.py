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

    def calculate_unit_price(self):
        timestamp = calendar.timegm(self.date.utctimetuple())
        req = requests.get("https://min-api.cryptocompare.com/data/pricehistorical" +
                           "?fsym=" + self.name + "&tsyms=NOK&ts=" + str(timestamp))
        res = json.loads(req.text)
        return res[self.name]["NOK"]

    def __str__(self):
        sale = "Salg" if self.is_sale else "Kjøp"
        qty = rounder(self.quantity)
        unit_p = rounder(self.unit_price)
        tot_p = rounder(self.total_price)
        return self.name + "," + str(self.date) + "," + sale + "," + str(qty) + "," + str(unit_p) + "," + str(tot_p) + "," + self.site


#Runder tall så det blir fint i tabell
def rounder(number):
    if number < 0:
        return round(number,5)
    elif number < 10:
        return round(number,2)
    else:
        return int(number)

#Fikser rebrands (ans) og kaller bcc for bch
def fix_name(name):
    fixes = {"ANS": "NEO", "BCC": "BCH"}
    if name in fixes.keys():
        return fixes[name]
    return name
