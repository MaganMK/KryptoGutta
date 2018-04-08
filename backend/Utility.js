import {Transaction} from "./Transaction.js";
import {CurrencyGroup} from "./CurrencyGroup.js";
import {groupByCurrency} from "./CurrencyGroup.js";

// Leser fil fra lokal mappe og returnerer gruppering
export function readFile()
{
    var result = [];
    $.get('../transactions/bittrex.csv', function(data)
    {
        let lines = String(data).split("\n");
        for (let i = 1; i < lines.length; i++)
        {
            let line = lines[i];
            let lineSplit = line.split(",");
            //I transaction kan vi lage en metode som sjekker hvilken exchange den skal lage transaction fra
            let transaction = new Transaction(lineSplit[1], lineSplit[2], lineSplit[3], lineSplit[6], lineSplit[8]);
            result.push(transaction);
        }
        return groupByCurrency(result);
    });
}

// Leser fil fra form og returnerer gruppering
export function readFormFile(file)
{
    var result = [];
        let lines = String(file).split("\n");
        for (let i = 1; i < lines.length; i++)
        {
            let line = lines[i];
            let lineSplit = line.split(",");
            let transaction = new Transaction(lineSplit[1], lineSplit[2], lineSplit[3], lineSplit[6], lineSplit[8]);
            result.push(transaction);
        }
        return groupByCurrency(result);
    ;
}