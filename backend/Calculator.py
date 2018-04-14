import pickle


def calculate(year):
    transactions = read_file()
    groups = group_transactions(transactions)
    groups = sort_on_date(groups)
    result = calculate_total(groups, year)
    write_to_result_file(result)


def write_to_result_file(result):
    writer = open("../results/result.txt", "w")
    writer.write(str(result) + " kr")
    writer.close()


def read_file():
    with open("../results/transactions.txt", "rb") as f:
        trans = []
        while 1:
            try:
                obj = pickle.load(f)
                trans.append(obj)
            except EOFError:
                break
    return trans


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


def calculate_total(groups, year):
    balance = 0
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
            if current_sale.date.year == year:
                balance += profit
        #Legger sammen alle salg som ikke finner matchende kjøp
        #for current_sale in groups[currency]["sales"]:
        #    current_sale.quantity = float(current_sale.quantity)
        #    if current_sale.quantity > 0:
        #        balance += current_sale.quantity * current_sale.unit_price
        #        current_sale.quantity = 0
    print(int(balance))
    return int(balance)
