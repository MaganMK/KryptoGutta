// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Viktig å sjekke at timestamp er riktig hvis ting ikke funker
export function setValue(tx, fromCurrency, toCurrency)
{
    tx.date = new Date(tx.date);
    let timestamp = tx.date.getTime()/1000;
    //let fromCurrency = tx.mainCurrency;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + timestamp;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        if (tx.site == "bittrex")
        {
            if (tx.fromCurrency == "ETH" || tx.fromCurrency == "BTC"){
                tx.quantity = tx.price;
                tx.unitPrice = json[fromCurrency][toCurrency];
                tx.value = tx.quantity * tx.unitPrice;
            }
            else
            {
                tx.value = json[fromCurrency][toCurrency] * tx.quantity;
                tx.unitPrice = tx.value/tx.quantity;
            }
        }
        else if (tx.site == "binance")
        {
            tx.unitPrice = json[fromCurrency][toCurrency] * tx.price;
            tx.value = tx.unitPrice * tx.quantity;
        }
        else if (tx.site == "coinbase") {
            if (fromCurrency != "EUR")
            {
                tx.unitPrice = json[fromCurrency][toCurrency];
                tx.value = tx.unitPrice * tx.quantity;
            }
        }
    });
}

export function fixMainPairs(groups, ticker) {
    if (ticker in groups){
        let group = groups[ticker];
        for (let i in group.sales)
        {
            setMainPrice(group.sales[i], ticker, "USD");
        }
        for (let i in group.buys)
        {
            setMainPrice(group.buys[i], ticker, "USD");
        }
    }
}

function setMainPrice(tx, fromCurrency, toCurrency)
{
    let timestamp = tx.date.getTime()/1000;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + timestamp;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
    if (tx.site != "coinbase") {
        tx.unitPrice = json[fromCurrency][toCurrency];
        tx.value = tx.unitPrice * tx.price;
        tx.quantity = tx.value/tx.unitPrice;
        }
    });
}