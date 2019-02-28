(function(document){

        xmlhttp=new XMLHttpRequest();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", 'http://www.teleman.pl', false );
    xmlhttp.send();    
    
})(document);