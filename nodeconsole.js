const readline = require('readline');
const Writable = require('stream').Writable;

let username = '';
let password = '';
let confirm = '';

const mutableStdout = new Writable({
    write: function(chunk, encoding, cb) {
        if (!this.muted) process.stdout.write(chunk, encoding);
        cb();
    }
});

mutableStdout.muted = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true
});

const setUsername = () => {
    return new Promise((resolve, reject) => {
        rl.question('Username: ', answer => {
            username = answer;
            resolve();
        });
    });
}

const setPass = () => {
    return new Promise((resolve, reject) => {
        rl.question('Password: ', answer => {
            password = answer;
            resolve()
        });
        mutableStdout.muted = true;
    });
}

const confirmPass = async () => {
    mutableStdout.muted = false;
    return new Promise((resolve, reject) => {
        rl.question('Confirm Password: ', answer => {
            confirm = answer;
            resolve();
        });
        mutableStdout.muted = true;
    });
}

const checkPasswords = async () => {
    if (confirm !== password) {
        console.log('\nPasswords do not match, try again\n');
        await confirmPass();
        await checkPasswords();
    }
}

const reset = () => {
    return process.stdout.write('\033c');
}

const main = async () => {
    reset();
    
    await setUsername();
    await setPass();
    await confirmPass();
    await checkPasswords();
    
    reset();
    console.log(`Username: ${username}\nPassword: ${password}`);
    rl.close();
}

main();