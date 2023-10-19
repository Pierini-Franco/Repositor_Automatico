function showHide(){
    var x = document.getElementById("password");
    var y = document.getElementById("re_password");
    if(x.type === "password"){
        x.type = "text";
        y.type = "text";
    }
    else {
        x.type = "password";
        y.type = "password";
    }
}

var bool;

function checkPassword(){
    var x = document.getElementById("password");
    var y = document.getElementById("re_password");
    var g = document.getElementById("dot");
    if(x.value === y.value){
        g.style="position: absolute; left: 0; width: 10px; height: 10px; border-radius: 50%; background-color: #00a800";
        bool = true;
    }
    else{
        g.style="position: absolute; left: 0; width: 10px; height: 10px; border-radius: 50%; background-color: #b91d08";
        bool = false;
    }
}

function checkLogin(){
    if(bool === false){
        alert("Error: Completar correctamente las casillas");
    }
    else{
        alert("Redirigir a otra pag");
        var x = document.getElementById("password").value;
        console.log(x)
    }
}