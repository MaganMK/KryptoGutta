import {getPrice} from "./HTTPhandler.js";


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

function updateValues(groups)
    {
        for(let key in groups)

        {
            let group = groups[key];
            console.log(group.sales);
            for (let key in group.sales)
            {
                let sale = group.sales[key]
                console.log("sale" + sale);
                sale.value = getPrice(sale.date, sale.quantity, sale.sellCurrency, "USD");
            }
            
            for (let buy in group.buys)
            {
                buy.value = getPrice(buy.date, buy.quantity, buy.buyCurrency, "USD");
            }
        }
    }

// Tar inn en liste med transaksjoner og returnerer objekt sortert på currencies
export function groupByCurrency(transactions){
    var sell = {};
    var buy = {};
    for (let i = 0; i < transactions.length; i++) {
        if(!(transactions[i].sellCurrency in sell)) {
            sell[transactions[i].sellCurrency] = [];
        }
        sell[transactions[i].sellCurrency].push(transactions[i]);
        if(!(transactions[i].buyCurrency in buy)) {
            buy[transactions[i].buyCurrency] = [];
        }
        buy[transactions[i].buyCurrency].push(transactions[i]);
    }

    var groups = {};

    Object.keys(sell).forEach(function(key) {
        let group = new CurrencyGroup(key);
        group.sales = sell[key];
        groups[key] = group;
    });

    Object.keys(buy).forEach(function(key) {
            if(key in groups)
            {
                var group = groups[key];
            }
            else {
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
                else {
                    mainGroup[key] = newGroup[key];
                }
    }
    return mainGroup;
}