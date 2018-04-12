


function invokePython(event)
{
    console.log("Javascript-kall");
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
            let content = e.target.result;
            xhttp.send(content); // Sender filene som strenge til serveren
        };
    }
}



document.getElementById("bittrex").addEventListener("change", invokePython, false);
document.getElementById("submit-btn").addEventListener("click", invokePython, false);