class Transaction {
  constructor(exchange, type, quantity, price, closed) {
    //BTC-ADA
    this.exchange = exchange.split("-");
    this.currencyGroup = this.exchange[1];
    this.quantity = quantity;
    this.price = price;
    this.closed = closed;
    if (type == "LIMIT_BUY") {
        this.sale = false;
        this.sellCurrency = this.exchange[0]
        this.buyCurrency = this.exchange[1]
    } else {
        this.sale = true;
        this.sellCurrency = this.exchange[1]
        this.buyCurrency = this.exchange[0]
    }
  }
}

class CurrencyGroup {
    constructor(name) {
        this.sales = []
        this.buys = []
        this.name = name;
    }
}

//OrderUuid,Exchange,Type,Quantity,Limit,CommissionPaid,Price,Opened,Closed
function readFile() {
    $.get('../transactions/bittrex.csv', function(data) {
        var result = []
        var lines = data.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].split(",");
            var transaction = new Transaction(line[1], line[2], line[3], line[6], line[8]);
            result.push(transaction);
        }
        return result;
    });
}

function groupByCurrency(list) {
    var currencyGroup = {};
    for each (tx in list) {
        if (tx.currencyGroup in currencyGroup) {
        }
    }
}






