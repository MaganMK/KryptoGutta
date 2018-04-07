
export class Transaction {
    constructor(exchange, type, quantity, price, closed) {
        this.exchange = String(exchange).split("-");
        this.currencyGroup = String(this.exchange[1]);
        this.quantity = quantity;
        this.price = price;
        this.closed = closed;
        if (type == "LIMIT_BUY")
        {
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