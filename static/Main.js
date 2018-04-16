var txDiv = document.getElementById("tx-table-div");
txDiv.style.display = "none";
var selector = document.getElementById("year-selector");
var calcBtn = document.getElementById("submit-btn");
calcBtn.disabled = true;

selector.addEventListener("change", function() {
    let val = selector.options[selector.selectedIndex].value;
    let validYears = ["2015", "2016", "2017", "2018"];
    if (validYears.indexOf(val) >= 0) {
        selector.style.backgroundColor = "#c5ffc4";
        selector.style.border = "solid #78d877";
        calcBtn.style.backgroundColor = "#c5ffc4";
        calcBtn.style.border = "solid #78d877";
        calcBtn.disabled = false;
    }
})

function startCalculation()
{
    document.body.style.cursor  = 'wait';
    let year = selector.options[selector.selectedIndex].value;

   $.ajax({
        type: "POST",
        data: year,
        url: "/result",
        success: function(pyResult){
            let res = pyResult.result;

            let green = "#c5ffc4";
            let greenBorder = "#78d877";
            let red = "#ff8c93";
            let redBorder = "#ed444f";
            let box1Color = res[0] >= 0 ? green : red;
            let box1Border = res[0] >= 0 ? greenBorder : redBorder;
            let box2Color = res[1] >= 0 ? green : red;
            let box2Border = res[1] >= 0 ? greenBorder : redBorder;

            box1.style.backgroundColor = box1Color;
            box1.style.border = "solid " + box1Border;

            box2.style.backgroundColor = box2Color;
            box2.style.border = "solid " + box2Border;

            box3.style.backgroundColor = green;
            box3.style.border = "solid " + greenBorder;


            let dropdown = document.getElementById("year-selector");
            let year = dropdown.options[dropdown.selectedIndex].value;
            document.getElementById("balance-header").innerText = "Balanse 31.12." + year;

            document.getElementById("filled").innerText = "\n\n\n" + res[0] + " kr";
            document.getElementById("unfilled").innerText = "\n\n\n" + res[1] + " kr";
            document.getElementById("balance").innerText = "\n\n\n" + res[2] + " kr";
            document.body.style.cursor  = 'default';
        }
    });

}

function invokePython(event)
{
    let exchange = event.target.id;
    var fileInput = document.getElementById(exchange.substring(0,exchange.length-1));
    fileInput.style.backgroundColor = "#c6e9ff";
    fileInput.style.borderColor = "#79ccff";
    document.body.style.cursor  = 'wait';
    let file = document.getElementById(exchange);
    if(file.files.length)
    {
        var reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);
        reader.onload= function(e)
        {
            let content = e.target.result;
            content = "" + exchange + "\n" + content;
                $.ajax({
                    type: "POST",
                    data: content,
                    url: "/newInput",
                    success: function(transactions){
                        $("#transaction-table tr").remove();
                        let table = document.getElementById("transaction-table");
                        let header = ["Valuta", "Dato", "Kjøp/Salg", "Kvantitet", "Enhetspris", "Totalpris", "Exchange"];
                        let row1 = table.insertRow(0);
                        row1.style = "font-weight: bold;";
                        for (let i = 0; i < header.length; i++) {
                            let cell = row1.insertCell(i);
                            cell.innerText = header[i];
                        }
                        txDiv.style.display = "block";
                        let txCount = document.getElementById("tx-count");
                        let count = transactions.trans.length;
                        txCount.innerText = "Registrerte transaksjoner: " + count;
                        for(let i in transactions.trans)
                        {
                            let lines = transactions.trans[i].split(",");
                            var row = table.insertRow(++i);
                            for(let i = 0; i < lines.length; i++)
                            {
                                let cell = row.insertCell(i);
                                cell.innerText = lines[i];
                            }
                        }
                        fileInput.style.backgroundColor = "#e0ffd8";
                        fileInput.style.borderColor = "#008927";
                        document.body.style.cursor  = 'default';
                    }
                });
        };
    }
}


document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("binance").addEventListener("change", invokePython, false);
document.getElementById("coinbase").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);
