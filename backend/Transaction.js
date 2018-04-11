export class Transaction {
    constructor(exchange, type, quantity, price, closed) {
        this.exchange = String(exchange);
        this.quantity = quantity;
        this.price = price;
        this.closed = closed;
        this.sellCurrency = "";
        this.buyCurrency = "";
        this.type = type;
        this.date = new Date();
        this.value = 0;
    }
}

//Lager transaksjon utifra hvilken exchange den kommer fra
export function createTransaction(exchange, data)
{
    if (exchange == "bittrex") { return bittrexTransaction(data); }
    if (exchange == "binance") { return binanceTransaction(data); }
    if (exchange == "coinbase") { return coinbaseTransaction(data); }
}

//OrderUuid,Exchange,Type,Quantity,Limit,CommissionPaid,Price,Opened,Closed
//8a9bf807-f899-4c07-95b8-9d312ef1e192,BTC-ADA,LIMIT_SELL,331,0.00006166,0.00005109,0.02043925,01/08/2018 08:35,
function bittrexTransaction(data)
{
    var tx = new Transaction(data[1], data[2], data[3], data[6], data[8]);
    tx.site = "bittrex";
    tx.exchange = String(tx.exchange).split("-");
    tx.mainCurrency = tx.exchange[0];
    tx.otherCurrency = tx.exchange[1];
    tx.date = (typeof tx.closed != "undefined" ? new Date(tx.closed) : new Date());
    if (tx.type == "LIMIT_BUY")
            {
                tx.sellCurrency = String(tx.exchange[0]);
                tx.buyCurrency = String(tx.exchange[1]);
            }
    else
            {
                tx.sellCurrency = String(tx.exchange[1]);
                tx.buyCurrency = String(tx.exchange[0]);
            }
    return tx;
}

//Date,Market,Type,Price,Amount,Total,Fee,Fee Coin
//2018-01-07 20:42:29,VENBTC,BUY,0.0002915,34,0.009911,0.034,VEN
function binanceTransaction(data)
{
    var tx = new Transaction(data[1], data[2], data[4], data[3], data[0]);
    tx.site = "binance";
    //tx.date = new Date(tx.closed.substring(0,4),tx.closed.substring(8,10), tx.closed.substring(5,7)); // Usikker på om denne daten funker i alle browsere
    tx.date = new Date(tx.closed);
    var i = tx.exchange.length == 6 ? 3 : 4; //Noen valutaer har 4 tegn, feks IOTA
    tx.mainCurrency = tx.exchange.substring(i);
    if (tx.type == "BUY")
    {
        tx.sellCurrency = tx.exchange.substring(i);
        tx.buyCurrency = tx.exchange.substring(0,i);
    }
    else
    {
        tx.buyCurrency = tx.exchange.substring(i);
        tx.sellCurrency = tx.exchange.substring(0,i);
    }
    return tx;
}

//Timestamp,        Balance,   Amount,  Currency,To,                    Notes,                                  Instantly Exchanged,Transfer Total,Transfer Total Currency,Transfer Fee,Transfer Fee Currency,Transfer Payment Method,Transfer ID,Order Price,Order Currency,Order BTC,Order Tracking Code,Order Custom Parameter,Order Paid Out,Recurring Payment ID,Coinbase ID (visit https://www.coinbase.com/transactions/[ID] in your browser),Bitcoin Hash (visit https://www.coinbase.com/tx/[HASH] in your browser for more info)
//05/06/2017 10:02,0.22623156,0.22623156,ETH,   592684de2205ad0a29e923da,Bought 0.22623156 ETH for €52.00 EUR.,false,               52,             EUR,2,EUR,Visa debit ********0040,59358e83ae4b985bafce2a36,,,,,,,,59358e8b79b72ea963dad41f,
//Coinbase er vel kun eur-crypto?
function coinbaseTransaction(data)
{
    //data[5] er notes, feks: Bought 0.22623156 ETH for €52.00 EUR
    var tx = new Transaction(data[3], data[5], data[2], data[7], data[0]);
    tx.site = "coinbase";
    tx.closed = tx.closed.substring(3,5) + "/" + tx.closed.substring(0,2) + "/" + tx.closed.substring(6,10);
    tx.date = new Date(tx.closed);
    tx.mainCurrency = tx.exchange;
    if (tx.type.substring(0,6) == "Bought")
    {
        tx.sellCurrency = "EUR";
        tx.buyCurrency = tx.exchange;

    }
    else
    {
        tx.buyCurrency = "EUR";
        tx.sellCurrency = tx.exchange;
    }
    return tx;
}