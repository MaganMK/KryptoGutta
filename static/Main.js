


function startCalculation()
{

   $.ajax({
        type: "POST",
        data: JSON.stringify(2017, null, '\t'),
        url: "/result",
        success: function(res){
            document.getElementById("income").innerText = "Estimert inntekt: " + res.result;
        }
    });

}

async function invokePython(event)
{
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/newInput", true);

    let exchange = event.target.id;
    let file = document.getElementById(exchange);
    if(file.files.length)
    {
        var reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);
        reader.onload= function(e)
        {
            let content = e.target.result;
            if(exchange == "bittrex")
            {
                content = "bittrex\n" + content;
            }
            xhttp.send(content);
        };
    }
}


document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);