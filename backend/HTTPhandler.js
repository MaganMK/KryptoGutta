// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Funker kanskje bare med usd
export function setValue(tx, date, fromCurrency, toCurrency)
{
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + date.getTime()/1000;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        tx.value = json[fromCurrency][toCurrency];
    });
}
