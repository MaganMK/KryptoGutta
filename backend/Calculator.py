
import pickle


def calculate(year):
    year = year.decode("utf-8")
    transactions = read_file()
    groups = group_transactions(transactions, year)
    groups = sort_on_date(groups)
    result = calculate_total(groups)


def read_file():
    with open("../backend/test.txt", "rb") as f:
        trans = []
        while 1:
            try:
                obj = pickle.load(f)
                trans.append(obj)
            except EOFError:
                break
    return trans


def group_transactions(transactions, year):
    groups = {}
    for tx in transactions:
        if tx.name not in groups:
            groups[tx.name] = {"sales": [], "buys": []}

        if tx.is_sale and tx.date.year == int(year):
            groups[tx.name]["sales"].append(tx)
        elif not tx.is_sale:
            groups[tx.name]["buys"].append(tx)
    return groups


def sort_on_date(groups):
    for name in groups.keys():
        groups[name]["sales"].sort(key = lambda tx : tx.date)
        groups[name]["buys"].sort(key=lambda tx: tx.date)

        for tx in groups[name]["sales"]:
            print(str(tx))
    return groups


def calculate_total(groups):
    balance = 0
    for currency in groups.keys():
        for current_sale in groups[currency]["sales"]:
            for current_buy in groups[currency]["buys"]:
                if current_sale.quantity > 0:
                    if current_buy.date <= current_sale.date:
                        if current_buy.quantity >= current_sale.quantity:
                            balance += current_sale.unit_price * current_sale.quantity - current_buy.unit_price * current_sale.quantity
                            current_buy.quantity -= current_sale.quantity
                            current_sale.quantity = 0
                        else:
                            balance += current_sale.unit_price * current_buy.quantity - current_buy.unit_price * current_buy.quantity
                            current_buy.quantity = current_sale.quantity
                            current_sale.quantity -= current_buy.quantity
        for current_sale in groups[currency]["sales"]:
            if current_sale.quantity > 0:
                balance += current_sale.quantity * current_sale.unit_price
                current_sale.quantity = 0
    print(balance)
    return balance
