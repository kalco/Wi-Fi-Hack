const { execSync } = require('child_process');

// Getting meta data  node index.js
const metaData = execSync('netsh wlan show profiles');

// Decoding meta data
const data = metaData.toString('utf-8');

// Splitting data by line by line
const lines = data.split('\r\n');

// Creating a list of profiles
const profiles = [];

// Traverse the data
for (const line of lines) {
    // Find "All User Profile" in each item
    if (line.includes('All User Profile')) {
        // If found, split the item
        const profileName = line.split(':')[1].trim();
        // Appending the WiFi name to the list
        profiles.push(profileName);
    }
}

// Printing heading
console.log(`${"Wi-Fi Name".padEnd(30)} ${"Password"}`);
console.log();

// Traverse the profiles
for (const profile of profiles) {
    try {
        // Getting meta data with password using WiFi name
        const result = execSync(`netsh wlan show profile name="${profile}" key=clear`);
        // Decoding and splitting data line by line
        const resultLines = result.toString('utf-8').split('\r\n');
        // Finding password from the result list
        const password = resultLines.find(line => line.includes('Key Content'));
        // If there is a password, it will print the password
        if (password) {
            console.log(`${profile.padEnd(30)} ${password.split(':')[1].trim()}`);
        } else {
            console.log(`${profile.padEnd(30)} ${''}`);
        }
    } catch (error) {
        console.log("Encoding Error Occurred");
    }
}
