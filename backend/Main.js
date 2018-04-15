/*
var box1 = document.getElementById("box1");
var box2 = document.getElementById("box2");
var box3 = document.getElementById("box3")
box1.style.display = "none";
box2.style.display = "none";
box3.style.display = "none";
*/

async function startCalculation()
{
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://127.0.0.1:5000/", true);
    var dropdown = document.getElementById("year-selector");
    let year = dropdown.options[dropdown.selectedIndex].value;
    xhttp.send(year);
    await sleep(5000);
    console.log("Sleep finished");
    //fetchResult();
    readResultFile();
}

async function invokePython(event)
{
    // Setter opp connection med serveren
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://127.0.0.1:5000/", true);

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
            content = "" + exchange + "\n" + content;
            xhttp.send(content); // Sender filene som strenger til serveren
        };
    }
}

function fetchResult()
{
    fetch('../results/result.txt')
        .then(response => response.text().split(","))
        .then(text => document.getElementById("filled").innerText = "Estimert inntekt: " + text);
}

function readResultFile()
{
    let url = "../results/result.txt";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", url, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                let res = allText.split(",");

                /*
                box1.style.display = "block";
                box2.style.display = "block";
                box3.style.display = "block";
                */

                let dropdown = document.getElementById("year-selector");
                let year = dropdown.options[dropdown.selectedIndex].value;
                document.getElementById("balance-header").innerText = "Balanse 31.12." + year;

                document.getElementById("filled").innerText = res[0];
                document.getElementById("unfilled").innerText = res[1];
                document.getElementById("balance").innerText = res[2];
            }
        }
    }
    rawFile.send(null);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("binance").addEventListener("change", invokePython, false);
document.getElementById("coinbase").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);
