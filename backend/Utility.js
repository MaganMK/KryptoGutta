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
        return groupByCurrency(res);
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
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        if(!(sell[key] in Object.keys(groups))) {
                    groups[key] = [];
                }
                let group = new CurrencyGroup(key);
                console.log(group);
                group.sales = sell[key];
                groups[key].push(group);
    });

    Object.keys(buy).forEach(function(key,index) {
            if(!(buy[key] in Object.keys(groups)))
            {
                groups[key] = [];
            }
            let group = new CurrencyGroup(key);
            group.buys = buy[key];
            groups[key].push(group);
        });
    console.log(groups);
    return groups;
}