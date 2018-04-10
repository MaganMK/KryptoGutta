import {readFormFile} from "./Utility.js";
import {uniteCurrencyGroups} from "./CurrencyGroup.js";

var saveCount = 0;

//Handterer filinput i form
function handleFileInput(event)
{
    var exchange = event.target.id;
    var file = document.getElementById(exchange);
    if(file.files.length)
    {
        var reader = new FileReader();

        reader.onload = function(e)
        {
            let content = e.target.result;
            var allGroups = getAllGroups(exchange, content);
        };
        reader.readAsBinaryString(file.files[0]);
    }
}

// Lagrer den siste leste gruppen og setter den sammen med tidligere lagrene grupper
function getAllGroups(exchange, content)
{
    var savedGroups;
    for (let i = 0; i < saveCount; i++) {
        savedGroups = uniteCurrencyGroups(savedGroups,loadCurrencyGroup(i));
    }
    var newGroup = readFormFile(exchange, content);
    saveCurrencyGroup(newGroup);
    return (saveCount == 1 ? newGroup : uniteCurrencyGroups(savedGroups, newGroup));
}

//Returnerer alle grupper som er lagret, feks brukes til utregning når man trykker på knappen
function getStoredGroups() {
    var groups;
    for (let i = 0; i < saveCount; i++)
    {
        groups = uniteCurrencyGroups(groups,loadCurrencyGroup(i));
    }
    return groups;
}

function saveCurrencyGroup(currencyGroup)
{
    sessionStorage.setItem(saveCount++, JSON.stringify(currencyGroup));
}

function loadCurrencyGroup(number) {
    return JSON.parse(sessionStorage.getItem(number));
}

// Kalkulerer gevinst/tap for alle currencygruppene
function calculateIncome(currencyGroups)
{
    var income = 0;

    console.log(currencyGroups);

    for (var group in currencyGroups)
    {
        //console.log(currencyGroups[group]);
        //currencyGroups[group] gir et currencyGroupObject
        // setBalance(currencyGroups[group];
    }
}

// Går gjennom kjøp og salg for en valuta og setter samlet gevinst/tap for denne
function setBalance(currencyGroup) {
    //Sett currencyGroups kjøp vs salg balanse
}

document.getElementById("bittrex").addEventListener("change", handleFileInput, false);
document.getElementById("binance").addEventListener("change", handleFileInput, false);
document.getElementById("coinbase").addEventListener("change", handleFileInput, false);

document.getElementById("submit").addEventListener("click", getStoredGroups, false);
