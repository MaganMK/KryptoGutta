import {Transaction, createTransaction} from "./Transaction.js";
import {CurrencyGroup} from "./CurrencyGroup.js";
import {groupByCurrency} from "./CurrencyGroup.js";

// Leser fil fra lokal mappe og returnerer gruppering
export function readFile()
{
    var result = [];
    $.get('../transactions/bittrex.csv', function(data)
    {
        let lines = String(data).split("\n");
        //Det må skippes ulike antall linjer for ulike exchanges (1 for binance og bittrex, 5 for coinbase)
        for (let i = 1; i < lines.length; i++)
        {
            let line = lines[i];
            let lineSplit = line.split(",");
            let transaction = new Transaction(lineSplit[1], lineSplit[2], lineSplit[3], lineSplit[6], lineSplit[8]);
            result.push(transaction);
        }
        return groupByCurrency(result);
    });
}

// Leser fil fra form og returnerer gruppering
export function readFormFile(exchange, file)
{
    var result = [];
    let lines = String(file).split("\n");
    let skippedLines = (exchange == "coinbase" ? 5 : 1); //Denne må gjøres til en funksjon ved flere exchanges
    for (let i = skippedLines; i < lines.length; i++)
    {
        let line = lines[i];
        if (line.length > 0)
        {
        let lineSplit = line.split(",");
        let transaction = createTransaction(exchange, lineSplit);
        result.push(transaction);
        }
    }
    return groupByCurrency(result);
}