class Transaction {
  constructor(exchange, type, quantity, price, closed) {
    this.exchange = String(exchange).split("-");
    this.currencyGroup = String(this.exchange[1]);
    this.quantity = quantity;
    this.price = price;
    this.closed = closed;
    if (type == "LIMIT_BUY") {
        this.sellCurrency = String(this.exchange[0]);
        this.buyCurrency = String(this.exchange[1]);
    }
    else
    {
        this.sellCurrency = String(this.exchange[1]);
        this.buyCurrency = String(this.exchange[0]);
    }
  }
}

class CurrencyGroup {
    constructor(name) {
        this.sales = []
        this.buys = []
        this.name = String(name);
    }
}

//OrderUuid,Exchange,Type,Quantity,Limit,CommissionPaid,Price,Opened,Closed
function readFile() {
    var res = $.get('../transactions/bittrex.csv', function(data) {
        var result = [];
        var lines = String(data).split("\n");
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].split(",");
            var transaction = new Transaction(line[1], line[2], line[3], line[6], line[8]);
            result.push(transaction);
        }
        return result;
    });
    return res;
}

function groupByCurrency() {
    var list = readTextFile('../transactions/bittrex.csv');
    var sell = {};
    var buy = {};
    for (tx in list) {
        console.log("helo");
        if(!(tx.sellCurrency in sell))
        {
            sell[tx.sellCurrency] = [];
        }
        sell[tx.sellCurrency].push(tx);
        if(!(tx.buyCurrency in buy))
            {
                buy[tx.buyCurrency] = [];
            }
        buy[tx.buyCurrency].push(tx);
    }
    console.log(sell);
    console.log(buy);
    var groups = {};

    for (key in sell)
    {
        if(!(key in groups))
        {
            groups[key] = [];
        }
        var group = new CurrencyGroup(key);
        group.sells = sell[key];
        groups[key].push(group);
    }

    for (key in buy)
    {
        if(key in groups)
        {
            groups[key].buys = buy[key];
        }
        else
        {
            var group = new CurrencyGroup(key);
            group.buys = buy[key];
            groups[key].push(group);
        }
    }
    return groups;
}

var groups = groupByCurrency();
console.log(groups);




