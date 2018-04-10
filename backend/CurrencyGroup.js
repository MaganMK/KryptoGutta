import {setValue} from "./HTTPhandler.js";
import {fixMainPairs} from "./HTTPhandler.js";

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
//cryptocompare.com - rate limit på 15 historie-requests per sekund, derfor sleep 1100ms
function updateValues(groups)
    {
        var count = 0;
        for (var majorKey in groups)
        {
            let group = groups[majorKey];
            for (let key in group.sales)
            {
                let sale = group.sales[key]
                setValue(sale, "USD");
                count++
                if (count % 15 == 0)
                {
                    sleep(1100);
                }
            }
            
            for (let key in group.buys)
            {
                let buy = group.buys[key];
                setValue(buy, "USD");
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
        let tx1 = transactions[i];
        let tx2 = jQuery.extend(true, {}, tx1); //Deep copy for å lage to ulike transaksjoner
        if(!(transactions[i].sellCurrency in sell))
        {
            sell[transactions[i].sellCurrency] = [];
        }
        sell[transactions[i].sellCurrency].push(tx1);

        if(!(transactions[i].buyCurrency in buy))
        {
            buy[transactions[i].buyCurrency] = [];
        }
        buy[transactions[i].buyCurrency].push(tx2);

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
    fixMainPairs(groups,"BTC");
    fixMainPairs(groups,"ETH");
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