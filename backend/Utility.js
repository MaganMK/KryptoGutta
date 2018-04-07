import {Transaction} from "./Transaction.js";
import {CurrencyGroup} from "./CurrencyGroup.js";

export function readFile()
{
    var res = [];
    $.get('../transactions/bittrex.csv', function(data)
    {
        let lines = String(data).split("\n");
        for (let i = 1; i < lines.length; i++)
        {
            let line = lines[i];
            let lineSplit = line.split(",");
            let transaction = new Transaction(lineSplit[1], lineSplit[2], lineSplit[3], lineSplit[6], lineSplit[8]);
            res.push(transaction);
        }
        var groups = groupByCurrency(res);
        console.log(groups); //Riktig her og
        return groups;
    });
}

export function groupByCurrency(res){
    var sell = {};
    var buy = {};
    for (let i = 0; i < res.length; i++) {
        if(!(res[i].sellCurrency in sell)) {
            sell[res[i].sellCurrency] = [];
        }
        sell[res[i].sellCurrency].push(res[i]);
        if(!(res[i].buyCurrency in buy)) {
            buy[res[i].buyCurrency] = [];
        }
        buy[res[i].buyCurrency].push(res[i]);
    }

    var groups = {};

    Object.keys(sell).forEach(function(key,index) {
        let group = new CurrencyGroup(key);
        group.sales = sell[key];
        groups[key] = group;
    });

    delete groups["undefined"];

    Object.keys(buy).forEach(function(key,index) {
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

    delete groups["undefined"];
    console.log(groups); //Alt er riktig gruppert her (tror jeg) men i master.js blir den undefined
    return groups;
}