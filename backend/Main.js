import {readFormFile} from "./Utility.js";

//Handterer filinput i form
function handleFileInput()
{
    var file = document.getElementById('file');
    var content = "";

    if(file.files.length)
    {
        var reader = new FileReader();

        reader.onload = function(e)
        {
            var content = e.target.result;
            calculateIncome(readFormFile(content));
        };
        reader.readAsBinaryString(file.files[0]);
    }
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

document.getElementById("file").addEventListener("change", handleFileInput, false);

