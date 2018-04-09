var response = "";

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    var resp = "";
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
            response = xmlHttp.responseText;
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
    return resp;
}

function callback(text) {
	//Håndterer tekst fra api-kallet
}

// Returnerer prisen for en enhet av fromCurrency i toCurrency på angitt dato
// Funker kanskje bare med usd
function getPrice(date, fromCurrency, toCurrecy)
{
    //Usikker på om getTime gir riktig timestamp
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + fromCurrency + "&tsyms=" + toCurrency + "&ts=" + date.getTime();
    let result = httpGetAsync(url);
    let obj = JSON.parse(result);
    return obj[currency][toCurrency];
}

function getPrice(url)
{
fetch(url)
  .then(function(response) {
    response.text().then(function(text) {
      storedText = text;
      done();
    });
  });
}
function handleText() {
  document.getElementById('i').textContent =
    "Here's what I got! \n" + storedText;
}

getUrl(url);