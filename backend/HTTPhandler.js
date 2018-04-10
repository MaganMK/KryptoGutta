// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Viktig å sjekke at timestamp er riktig hvis ting ikke funker
export function setValue(tx, date, fromCurrency, toCurrency)
{
    let timestamp = date.getTime()/1000;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + timestamp;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        tx.value = json[fromCurrency][toCurrency];
    });
}
