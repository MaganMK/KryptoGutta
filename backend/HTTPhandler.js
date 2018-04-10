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
        //let btcprice = json["BTC"][toCurrency];
        //console.log(tx.value/btcprice);
        tx.unitPrice = tx.value/tx.quantity;
    });
}
