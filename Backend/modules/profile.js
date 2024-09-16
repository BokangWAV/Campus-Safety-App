//const { response } = require('express');
const { auth, provider, db } = require('./init.js');
const { collection, getDocs, query, where } = require('firebase/firestore');

const uid = "tGbbA7VNkhZtmb8IbvLt0fckxIu2"

// Fetch user data from the Azure Web API
async function getUser() { 
    try {
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        //console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const userData = await response.json();
        //console.log(userData); // Log user data for debugging

        return userData; // Return the fetched user data
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null; // Handle error and return null or an appropriate response
    }
}

module.exports = { getUser };
