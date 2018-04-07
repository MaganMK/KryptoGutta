import {readFile2} from "./Utility.js";

//var groups = readFile();
//console.log(groups);

function handleFileInput()
{
    var file = document.getElementById('file');
    var content = "";

    if(file.files.length)
    {
        var reader = new FileReader();

        reader.onload = function(e)
        {
            var content = e.target.result;
            console.log(readFile2(content));
            //Skriver ut filinnholdet gruppert i valutaer
            //Går ikke an å lagre det eller returnere det.........?
        };
        reader.readAsBinaryString(file.files[0]);
    }
}

document.getElementById("file").addEventListener("change", doSomething, false);

