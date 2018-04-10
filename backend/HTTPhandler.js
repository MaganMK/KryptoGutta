// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Viktig å sjekke at timestamp er riktig hvis ting ikke funker
export function setValue(tx, toCurrency)
{
    let timestamp = tx.date.getTime()/1000;
    let fromCurrency = tx.mainCurrency;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + timestamp;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        tx.value = json[fromCurrency][toCurrency] * tx.price;
        tx.unitPrice = tx.value/tx.quantity;
    });
}

export function fixMainPairs(groups, ticker) {
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

function setMainPrice(tx, fromCurrency, toCurrency)
{
    let timestamp = tx.date.getTime()/1000;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + timestamp;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        tx.unitPrice = json[fromCurrency][toCurrency];
        tx.quantity = tx.value/tx.unitPrice;
    });
}