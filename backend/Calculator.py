import pickle
import calendar
import requests
import json
from dateutil import parser
import copy


def calculate(year, transactions):
    groups = group_transactions(transactions)
    groups = sort_on_date(groups)

    year_balance = get_total_balance(groups, year)
    filled, unfilled = calculate_total(groups, year)
    results = [filled, unfilled, year_balance]
    return results

def group_transactions(transactions):
    groups = {}
    for tx in transactions:
        if tx.name not in groups:
            groups[tx.name] = {"sales": [], "buys": []}
        if tx.is_sale:
            groups[tx.name]["sales"].append(tx)
        else:
            groups[tx.name]["buys"].append(tx)
    return groups


def sort_on_date(groups):
    for name in groups.keys():
        groups[name]["sales"].sort(key = lambda tx : tx.date)
        groups[name]["buys"].sort(key=lambda tx: tx.date)
    return groups


def calculate_total(main_groups, year):
    groups = copy.deepcopy(main_groups)
    filled = 0
    unfilled = 0
    for currency in groups.keys():
        for current_sale in groups[currency]["sales"]:
            profit = 0
            for current_buy in groups[currency]["buys"]:
                current_sale.quantity = float(current_sale.quantity)
                if current_sale.quantity > 0:
                    if current_buy.date <= current_sale.date:
                        current_buy.quantity = float(current_buy.quantity)
                        if current_buy.quantity >= current_sale.quantity:
                            profit += current_sale.unit_price * current_sale.quantity - current_buy.unit_price * current_sale.quantity
                            current_buy.quantity -= current_sale.quantity
                            current_sale.quantity = 0
                        else:
                            profit += current_sale.unit_price * current_buy.quantity - current_buy.unit_price * current_buy.quantity
                            current_buy.quantity = current_sale.quantity
                            current_sale.quantity -= current_buy.quantity
            if current_sale.date.year == int(year):
                filled += profit
                unfilled += current_sale.quantity * current_sale.unit_price
                current_sale.quantity = 0
    return int(filled), int(unfilled)


def get_total_balance(groups, year):
    date_string = "12/31/" + str(year) + " 23:59"
    end_year_date = parser.parse(date_string)
    balance = 0
    for currency in groups.keys():
        qty = 0
        for buy in groups[currency]["buys"]:
            if buy.date <= end_year_date:
                qty += buy.quantity
        for sale in groups[currency]["sales"]:
            if sale.date <= end_year_date:
                qty -= sale.quantity
        currency_balance = calculate_unit_price(end_year_date, currency) * qty
        if currency_balance > 0:
            balance += currency_balance
    return int(balance)


def calculate_unit_price(date, currency):
    timestamp = calendar.timegm(date.utctimetuple())
    req = requests.get("https://min-api.cryptocompare.com/data/pricehistorical" +
                       "?fsym=" + currency + "&tsyms=NOK&ts=" + str(timestamp))
    res = json.loads(req.text)
    return res[currency]["NOK"]
