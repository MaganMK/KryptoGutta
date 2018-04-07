
import {Transaction} from "./Transaction.js";
import {CurrencyGroup} from "./CurrencyGroup.js";

let res = [];
export function readFile()
{

    $.get('../transactions/bittrex.csv', function(data)
    {
        let result = [];
        let lines = String(data).split("\n");
        for (let i = 1; i < lines.length; i++)
        {
            let line = lines[i];
            let lineSplit = line.split(",");
            let transaction = new Transaction(lineSplit[1], lineSplit[2], lineSplit[3], lineSplit[6], lineSplit[8]);
            result.push(transaction);
            res.push(transaction);
        }
        return result;
    });

    return [];
}

export function groupByCurrency(){
    readFile('../transactions/bittrex.csv');
    let sell = {};
    let buy = {};
    console.log(res); // Denne er riktig
    console.log(res.length); // Men length gir fortsatt 0.... HVA FAEN
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

    console.log(sell.keys);
    let groups = {};

    for (let i = 0; i < sell.length; i++) {
        if(!(sell[i] in groups)) {
            groups[i] = [];
        }
        let group = new CurrencyGroup(sell[i]);
        group.sells = sell[i];
        groups[sell[i]].push(group);
    }

    for (let i = 0; i < buy.length; i++) {
        if(buy[i] in groups) {
            groups[buy[i]].buys = buy[i];
        }
        else {
            let group = new CurrencyGroup(key);
            group.buys = buy[i];
            groups[buy[i]].push(group);
        }
    }
    return groups;
}