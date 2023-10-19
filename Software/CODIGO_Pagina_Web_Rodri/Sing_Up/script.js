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

function checkPassword(){
    var bool_password;
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

function checkApplication(){
    var bool_userdata;
    var name = document.getElementById("name");
    var lastname = document.getElementById("lastname");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var re_password = document.getElementById("re_password");

    if (!(name && name.value)) {
        name.style="border: 1px solid #b91d08;"
        bool_userdata = false
    }
    if (!(lastname && lastname.value)) {
        lastname.style="border: 1px solid #b91d08;"
        bool_userdata = false
    }
    if (!(email && email.value)) {
        email.style="border: 1px solid #b91d08;"
        bool_userdata = false
    }
    if(!(password && password.value)){
        password.style="border: 1px solid #b91d08;"
        bool_userdata = false
    }
    if(!(re_password && re_password.value)){
        re_password.style="border: 1px solid #b91d08; margin-bottom: 15px"
        bool_userdata = false
    }
    else{
        bool_userdata = true;
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
        console.log(x)
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