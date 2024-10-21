import { account } from "../appwrite/app";

// import { account } from "../appwrite/app";

function forgotPassword(email){
    const url = "http://localhost:5173/src/Reset.html"
    const promise = account.createRecovery(email,url);
    promise.then(function (response) {
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });
}

function handleSubmit(){
    var email = document.getElementById('email').value;
    if(email == ""){
        alert("Please enter your email");
    }else{
        forgotPassword(email);
        alert("An email has been sent to your email address");
    }
}

document.getElementById('submit').addEventListener('click', handleSubmit);