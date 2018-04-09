// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Funker kanskje bare med usd
export function getPrice(date,quantity, fromCurrency, toCurrency)
{
    console.log("HIT");
    //Usikker på om getTime gir riktig timestamp
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + date.getTime();
    let obj;
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        callback(json);
    });
    obj = loadJSON();
    return obj[fromCurrency][toCurrency];
}

function callback(text) {
    saveJSON(text);
}

function saveJSON(obj)
{
    sessionStorage.setItem("price", JSON.stringify(obj));
}

function loadJSON() {
    return JSON.parse(sessionStorage.getItem("price"));
}
