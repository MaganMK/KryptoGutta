
let xhttp = new XMLHttpRequest();
xhttp.open("POST", "http://127.0.0.1:5000/", true);

async function startCalculation()
{
    xhttp.open("POST", "http://127.0.0.1:5000/", true);
    var dropdown = document.getElementById("year-selector");
    let year = dropdown.options[a.selectedIndex].value;
    xhttp.send(year);
    await sleep(5000);
    console.log("Sleep finished");
    fetchResult();
}

async function invokePython(event)
{



    // Setter opp conection med serveren


    // Henter ut opplastede filer
    let exchange = event.target.id;
    console.log(exchange);
    let file = document.getElementById(exchange);
    if(file.files.length)
    {
        var reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);
        reader.onload= function(e)
        {
            let content = e.target.result;
            if(exchange == "bittrex")
            {
                content = "bittrex\n" + content;
            }
            xhttp.send(content); // Sender filene som strenge til serveren
        };
    }
}

function fetchResult()
{
    fetch('../backend/result.txt')
        .then(response => response.text())
        .then(text => document.getElementById("income").innerText = "Estimert inntekt: " + text);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);
