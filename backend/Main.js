


function invokePython()
{
    console.log("Kjør da");

    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://127.0.0.1:5000/", true);

    xhttp.send();
}


document.getElementById("submit-btn").addEventListener("click", invokePython, false);