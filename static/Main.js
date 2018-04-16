

function startCalculation()
{

    var dropdown = document.getElementById("year-selector");
    let year = dropdown.options[dropdown.selectedIndex].value;

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
        }
    });

}

function invokePython(event)
{
     let exchange = event.target.id;
    let file = document.getElementById(exchange);
    if(file.files.length)
    {
        var reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);
        reader.onload= function(e)
        {
            let content = e.target.result;
            content = "" + exchange + "\n" + content;
            console.log(content);
                $.ajax({
                    type: "POST",
                    data: content,
                    url: "/newInput",
                    success: function(transactions){
                        console.log(transactions.trans);

                        for(let tx in transactions.trans)
                        {
                            var node = document.createElement("LI");
                            let textNode = document.createTextNode(transactions.trans[tx]);
                            node.appendChild(textNode);
                            document.getElementById("transDiv").appendChild(node)
                        }
                    }

                });
        };
    }


}


document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("binance").addEventListener("change", invokePython, false);
document.getElementById("coinbase").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);
