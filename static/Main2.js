
var box1 = document.getElementById("box1");
var box2 = document.getElementById("box2");
var box3 = document.getElementById("box3")
/*
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
    await sleep(10000);
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
        .then(response => response.text())
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
                let green = "#c5ffc4";
                let greenBorder = "#78d877";
                let red = "#ff8c93";
                let redBorder = "#ed444f";
                let box1Color = res[0] >= 0 ? green : red;
                let box1Border = res[0] >= 0 ? greenBorder : redBorder;
                let box2Color = res[1] >= 0 ? green : red;
                let box2Border = res[1] >= 0 ? greenBorder : redBorder;

                box1.style.backgroundColor = box1Color;
                box1.style.border = "solid " + box1Border;

                box2.style.backgroundColor = box2Color;
                box2.style.border = "solid " + box2Border;

                box3.style.backgroundColor = green;
                box3.style.border = "solid " + greenBorder;


                let dropdown = document.getElementById("year-selector");
                let year = dropdown.options[dropdown.selectedIndex].value;
                document.getElementById("balance-header").innerText = "Balanse 31.12." + year;

                document.getElementById("filled").innerText = "\n\n\n" + res[0] + " kr";
                document.getElementById("unfilled").innerText = "\n\n\n" + res[1] + " kr";
                document.getElementById("balance").innerText = "\n\n\n" + res[2] + " kr";
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
