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

var bool_password;

function checkPassword(){
    
    var password = document.getElementById("password");
    var re_password = document.getElementById("re_password");
    var dot = document.getElementById("dot");

    if(!((re_password && re_password.value)) && !((password && password.value))){
        dot.style="position: absolute; left: 0; width: 10px; height: 10px; border-radius: 50%; background-color: #7a7a7a";
        bool_password = false;
    }
    if(password.value === re_password.value && ((re_password && re_password.value)) && ((password && password.value))){
        dot.style="position: absolute; left: 0; width: 10px; height: 10px; border-radius: 50%; background-color: #00a800";
        bool_password = true;
    }
    else{
        dot.style="position: absolute; left: 0; width: 10px; height: 10px; border-radius: 50%; background-color: #b91d08";
        bool_password = false;
    }
    return bool_password;
}

function setStyle(){
    var name = document.getElementById("name");
    var lastname = document.getElementById("lastname");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var re_password = document.getElementById("re_password");
    
    name.style="border: 1px solid #b91d08;";
    lastname.style="border: 1px solid #b91d08;";
    email.style="border: 1px solid #b91d08;";
    password.style="border: 1px solid #b91d08;";
    re_password.style="border: 1px solid #b91d08; margin-bottom: 15px";
}

var bool_userdata;

function checkApplication(){
    
    var name = document.getElementById("name");
    var lastname = document.getElementById("lastname");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var re_password = document.getElementById("re_password");

    if (!(name && name.value)) {
        setStyle();
        bool_userdata = false
        console.log("No hay nada en nombre");
    }
    else if (!(lastname && lastname.value)) {
        setStyle();
        bool_userdata = false
    }
    else if (!(email && email.value)) {
        setStyle();
        bool_userdata = false
    }
    else if (!(password && password.value)){
        setStyle();
        bool_userdata = false
    }
    else if (!(re_password && re_password.value)){
        setStyle();
        bool_userdata = false
    }
    else {
        bool_userdata = true;
        console.log("soy verdadero");
    }
    return bool_userdata;
}

function checkLogin(){

    if(checkApplication() === false || checkPassword() === false){
        alert("Error: Completar correctamente las casillas");
    }
    else{
        alert("Redirigir a otra pag");
        var x = document.getElementById("password").value;
        console.log(x);
        console.log(bool_userdata);
        console.log(bool_password);
    }
}

function resetStyleName(){
    var name = document.getElementById("name");
    name.style="border-color: #7a7a7a";
}

function resetStyleLastname(){
    var lastname = document.getElementById("lastname");
    lastname.style="border-color: #7a7a7a";
}

function resetStyleEmail(){
    var email = document.getElementById("email");
    email.style="border-color: #7a7a7a";
}

function resetStylePasswords(){
    var password = document.getElementById("password");
    var re_password = document.getElementById("re_password");
    password.style="border-color: #7a7a7a";
    re_password.style="border-color: #7a7a7a; margin-bottom: 15px;";
}