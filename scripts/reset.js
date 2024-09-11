import { account } from "../appwrite/app";

function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function handleReset(event) {
    event.preventDefault();
    const pass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const userId = getUrlParameter('userId');
    const secret = getUrlParameter('secret');

    if (!userId || !secret) {
        alert("Invalid or missing recovery information.");
        return;
    }

    if (pass === "" || confirmPass === "") {
        alert("Please enter your new password");
    } else if (pass !== confirmPass) {
        alert("Passwords do not match");
    } else {
        console.log("Password: " + pass);
        account.updateRecovery(userId, secret, pass)
            .then(function (response) {
                console.log(response); // Success
                alert("Password reset successfully!");
            }, function (error) {
                console.log(error); // Failure
                alert("Error resetting password. Please try again.");
            });
    }
}

document.getElementById('resetPasswordForm').addEventListener('submit', handleReset);
