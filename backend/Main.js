


function invokePython(event)
{
    // Setter opp conection med serveren
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://127.0.0.1:5000/", true);

    // Henter ut opplastede filer
    let exchange = event.target.id;
    let file = document.getElementById(exchange);
    if(file.files.length)
    {
        var reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);
        reader.onload= function(e)
        {
            console.log("Javascript-kall");

            let content = e.target.result;
            xhttp.send(content); // Sender filene som strenge til serveren
        };
    }


    let result = "NO RESULT";

    fetch('../backend/test.txt')
        .then(response => response.text())
        .then(text => result = document.getElementById("income").innerText = "Estimert inntekt: " + text);




}



document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", invokePython, false);