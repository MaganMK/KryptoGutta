import {readFormFile} from "./Utility.js";
import {uniteCurrencyGroups} from "./CurrencyGroup.js";
import {fixMainPairs} from "./HTTPhandler.js";
import {updateValues} from "./CurrencyGroup.js";
import {setValue} from "./HTTPhandler.js";

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

    let groups = updateValues(groups);
    fixMainPairs(groups,"BTC");
    fixMainPairs(groups,"ETH");

    for (var key in groups)
    {

        let group = groups[key];

        // Sortere gruppene på dato
        group.sales.sort(function (a,b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        });

        group.buys.sort(function (a,b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        });

        // Fjerene salg som ikke har på riktig årstall
        group.sales = group.sales.filter(function(transaction){
            return new Date(transaction.date).getFullYear() == year;
        });


        // Gå gjennom hvert salg og se på tilhørende kjøp
        for (let saleIndex in group.sales)
        {
            let currentSale = group.sales[saleIndex];
            currentSale.date = new Date(currentSale.date);

            //Får ikke tak i unitPrice
            for (let buyIndex in group.buys)
            {
                if(currentSale.quantity > 0)
                {
                    let currentBuy = group.buys[buyIndex];
                    currentBuy.date = new Date(currentBuy.date);

                    if(currentBuy.date.getTime() <= currentSale.date.getTime())
                    {

                        let profit = 0;

                        if(currentBuy.quantity > currentSale.quantity)
                        {
                            profit = currentSale.quantity*currentSale.unitPrice - currentSale.quantity*currentBuy.unitPrice;
                            currentBuy.quantity = currentBuy.quantity - currentSale.quantity;
                            currentSale.quantity = 0;
                            console.log("1 " + profit);
                        }
                        else if(currentBuy.quantity == currentSale.quantity)
                        {
                            profit = currentSale.quantity*currentSale.unitPrice - currentSale.quantity*currentBuy.unitPrice;
                            currentBuy.quantity = currentBuy.quantity - currentSale.quantity;
                            currentSale.quantity = 0;
                            console.log("2 " + profit);
                        }
                        else
                        {
                            console.log(currentBuy);
                            console.log(currentBuy.unitPrice);

                            profit = currentBuy.quantity*currentSale.unitPrice - currentBuy.quantity*currentBuy.unitPrice;
                            currentSale.quantity -= currentBuy.quantity;
                            currentBuy.quantity = 0;
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
document.getElementById("bittrex").addEventListener("change", handleFileInput, false);
document.getElementById("binance").addEventListener("change", handleFileInput, false);
document.getElementById("coinbase").addEventListener("change", handleFileInput, false);

document.getElementById("submit-btn").addEventListener("click", getStoredGroups, false);