import { account, client } from "../appwrite/app.js";
import {v4 as uuidv4} from 'uuid';
import { Users } from "node-appwrite";

const users = new Users(client);

function handleSignUp() {
    const signupform = document.getElementById('signup-form')
    if(!signupform){
        console.error('Signup form not found!')
        return;
    }

    signupform.addEventListener('submit',(e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const selectedRole = document.querySelector('input[name="role"]:checked')?.value;
        const userId = uuidv4();

        console.log('Signup Details:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password', password);
        console.log('Role:', selectedRole);

        const promise = account.create(userId,email,password,name);

        promise.then(function(response){
            console.log('Signup successful:',response);
            assignUserLabel(response.$id, selectedRole);
            if(response.role === 'admin'){
                console.log('Admin logged in');
                alert('Admin created successfully');
                // Redirect to admin page
            }else{
                console.log('User logged in');
                alert('User created successfully');
                // Redirect to user page
                window.location.href = '../index.html';
            }
        })

        signupform.reset();
    });
}

function assignUserLabel(userId, role) {
    const label = role === 'admin' ? 'admin' : 'user';

    users.updateLabels(userId, [label])
        .then(response => {
            console.log('Label assigned:', response);
        })
        .catch(error => {
            console.error('Failed to assign label:', error);
        });
}


document.addEventListener('DOMContentLoaded', () => {
    handleSignUp();
    
})