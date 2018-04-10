import {setValue} from "./HTTPhandler.js";
import {createTransactionFromTransaction} from "./Transaction.js";

//Klasse for å hver enkelt currency og hver kjøp og salg gjort med den
export class CurrencyGroup {
    constructor(name)
    {
        this.sales = [];
        this.buys = [];
        this.name = String(name);
        this.balance = 0;
    }
}

//Oppdaterer value-feltet til transaksjoner med verdien per enhet på den angitte datoen
//cryptocompare.com - må kjøre sleep i en viss tid for å ikke overgå rate limit
function updateValues(groups)
    {
        var count = 0;
        for (var majorKey in groups)
        {
            let group = groups[majorKey];
            for (let key in group.sales)
            {
                let sale = group.sales[key]
                setValue(sale, sale.date, majorKey, "NOK");
                count++
                if (count % 15 == 0)
                {
                    sleep(1000);
                }
            }
            
            for (let key in group.buys)
            {
                let buy = group.buys[key];
                setValue(buy, buy.date, majorKey, "NOK");
                count++;
                if (count % 15 == 0)
                {
                    sleep(1100);
                }
            }
    }
}

// Tar inn en liste med transaksjoner og returnerer objekt sortert på currencies
export function groupByCurrency(transactions){
    var sell = {};
    var buy = {};
    for (let i = 0; i < transactions.length; i++)
    {
        //Her blir en og samme transaction lagt inn i to forskjellige currencies, det må endres
        if(!(transactions[i].sellCurrency in sell))
        {
            sell[transactions[i].sellCurrency] = [];
        }
        sell[transactions[i].sellCurrency].push(createTransactionFromTransaction(transactions[i]));
        //sell[transactions[i].sellCurrency].push(transactions[i]);

        if(!(transactions[i].buyCurrency in buy))
        {
            buy[transactions[i].buyCurrency] = [];
        }
        buy[transactions[i].buyCurrency].push(createTransactionFromTransaction(transactions[i]));
        //buy[transactions[i].buyCurrency].push(transactions[i]);

    }

    var groups = {};

    Object.keys(sell).forEach(function(key)
    {
        let group = new CurrencyGroup(key);
        group.sales = sell[key];
        groups[key] = group;
    });

    Object.keys(buy).forEach(function(key)
    {
        if(key in groups)
        {
            var group = groups[key];
        }
        else
        {
            var group = new CurrencyGroup(key);
        }
        group.buys = buy[key];
        groups[key] = group;
    });

    //Fjerner alle rare undefined som kommer med
    delete groups["undefined"];
    delete groups["unde"];
    delete groups["fined"];

    updateValues(groups);
    console.log(groups);
    return groups;
}

// Metode for å forene to currencyGroups mtp lagring av andre exchanges og kombinering
export function uniteCurrencyGroups(mainGroup, newGroup) {
    if (typeof mainGroup == "undefined")
    {
        return newGroup;
    }
    for (let key in newGroup)
    {
        if(key in mainGroup)
        {
            mainGroup[key].buys = mainGroup[key].buys.concat(newGroup[key].buys);
            mainGroup[key].sales = mainGroup[key].sales.concat(newGroup[key].sales);
        }
        else
        {
            mainGroup[key] = newGroup[key];
        }
    }
    return mainGroup;
}

//Funksjon for å pause programmet
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds)
        {
            break;
        }
  }
}