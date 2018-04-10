// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Funker kanskje bare med usd
export function setValue(tx, date, fromCurrency, toCurrency)
{
    let timestamp = date.getTime()/1000;
    //Problemet nå er at timestamp ikke blir riktig
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + timestamp;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        console.log(json);
        //json gir error, timestamp ugyldig, fordi den er en float
        tx.value = json[fromCurrency][toCurrency];
    });
}
