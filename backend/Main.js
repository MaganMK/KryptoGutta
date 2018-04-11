import {readFormFile} from "./Utility.js";
import {uniteCurrencyGroups} from "./CurrencyGroup.js";
import {fixMainPairs} from "./HTTPhandler.js";
import {updateValues} from "./CurrencyGroup.js";

var saveCount = 0;

//Handterer filinput i form
function handleFileInput(event)
{
    var exchange = event.target.id;
    var file = document.getElementById(exchange);
    document.getElementById(exchange.substring(0,exchange.length-1)).style = "background-color: #edffed; border-color: #00c400;";
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
    delete groups["EUR"];
    calculateIncome(groups, 2018);
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
function calculateIncome(groups, year)
{
    var income = 0;

    updateValues(groups);
    fixMainPairs(groups,"BTC");
    fixMainPairs(groups,"ETH");

    console.log(groups);

    //console.log(currencyGroups); riktig

    for (var key in groups)
    {
        let group = groups[key];
        //console.log(group); riktig

        // Sortere gruppene på dato
        group.sales.sort(function (a,b) {
            return a.date.getTime() - b.date.getTime()
        });

        group.buys.sort(function (a,b) {
            return a.date.getTime() - b.date.getTime();
        });

        // Fjerene salg som ikke har på riktig årstall
        group.sales = group.sales.filter(function(transaction){
            return transaction.date.getFullYear() == year;
        });


        // Gå gjennom hvert salg og se på tilhørende kjøp
        for (let saleIndex in group.sales)
        {
            let currentSale = group.sales[saleIndex];
            //console.log(currentSale) riktig
            for (let buyIndex in group.buys)
            {
                if(currentSale.quantity > 0)
                {
                    let currentBuy = group.buys[buyIndex];
                    //console.log(currentBuy); riktig

                    if(currentBuy.date.getTime() <= currentSale.date.getTime())
                    {
                        let buyQuantity = currentBuy.quantity;
                        let saleQuantity = currentSale.quantity;
                        //console.log(buyQuantity); riktig

                        let profit = 0;

                        if(buyQuantity > saleQuantity)
                        {
                            profit = saleQuantity*currentSale.unitPrice - saleQuantity*currentBuy.unitPrice;
                            currentBuy.quantity = buyQuantity - saleQuantity;
                            currentSale.quantity = 0;
                            console.log("1 " + profit);
                        }
                        else if(buyQuantity == saleQuantity)
                        {
                            profit = saleQuantity*currentSale.unitPrice - saleQuantity*currentBuy.unitPrice;
                            currentBuy.quantity = buyQuantity - saleQuantity;
                            currentSale.quantity = 0;
                            console.log("2 " + profit);
                        }
                        else
                        {
                            profit = buyQuantity*currentSale.unitPrice - buyQuantity*currentBuy.unitPrice;
                            currentBuy.quantity = 0;
                            currentSale.quantity -= buyQuantity;
                            console.log("3 " + profit);
                        }
                        income += profit;
                    }
                }

            }
        }
        for (let saleIndex in group.sales)
        {
            let currentSale = group.sales[saleIndex];
            if (currentSale.quantity > 0) {
                income += currentSale.quantity*currentSale.unitPrice;
            }
        }

        console.log(income);

    }

}

// Går gjennom kjøp og salg for en valuta og setter samlet gevinst/tap for denne
function setBalance(currencyGroup) {
    //Sett currencyGroups kjøp vs salg balanse
}

document.getElementById("bittrex").addEventListener("change", handleFileInput, false);
document.getElementById("binance").addEventListener("change", handleFileInput, false);
document.getElementById("coinbase").addEventListener("change", handleFileInput, false);

document.getElementById("submit-btn").addEventListener("click", getStoredGroups, false);
