function showHide(){
    var x = document.getElementById("password");
    if(x.type === "password"){
        x.type = "text";
    }
    else {
        x.type = "password";
    }
}

function login(){
    var x = document.getElementById("password").value;
    console.log(x)
}