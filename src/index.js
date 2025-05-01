class Bank {
    constructor() {
        this.accounts = []; // Array to hold account objects
        this.eventHendlers = []; // Array to hold event handlers
        this.nextId = 1; // Counter for generating unique identifiers
    }

    on(event, callback) { // Method to register event handlers
        if (!this.eventHendlers[event]) { // Check if the event type already has handlers
            this.eventHendlers[event] = []; // If not, initialize it as an empty array
        }
        this.eventHendlers[event].push(callback); // Add the callback to the list of handlers for this event type
    }

    emit(eventName, ...args) { // Method to trigger events
        if (eventName === 'error') { // Check if the event name is 'error'
            const errorMessage = args[0]; // Extract the error message from the arguments
            if (this.eventHendlers['error']) { // Check if there are any error event handlers
                this.eventHendlers['error'].forEach(callback => callback(errorMessage)); // Call each error handler with the error message
            }
            return; // Exit the function after handling the error
        }

        if (eventName !== 'send') { // Check if the event name is not 'send'
            const personId = args[0]; // Extract the personId from the arguments
            if (!this.accounts[personId]) { // Check if there is an account with the given personId
                this.emit('error', `Account with ID ${personId} does not exist`); // Emit an error if it does not exist
                return; // Exit the function if the account does not exist
            }
        }

        switch (eventName) { // Switch statement to handle different event types
            case 'add':
                this.handleAdd(personId, args[1]); // Call the handleAdd method with the personId and amount
                break; // Exit the switch statement after handling the add event
            case 'get':
                this.handleGet(personId, args[1]); // Call the handleGet method with the personId and amount
                break; // Exit the switch statement after handling the get event
            case 'withdraw':
                this.handleWithdraw(personId, args[1]); // Call the handleWithdraw method with the personId and amount
                break; // Exit the switch statement after handling the withdraw event
            case 'send':
                this.handleSend(personId, args[1], args[2]); // Call the handleSend method with the personId and amount and recipient
                break; // Exit the switch statement after handling the send event
            default:
                this.emit('error', `Unknown event: ${eventName}`); // Emit an error for unknown event types
        }
    }

    register({ name, balance }) { // Method to register a new account
        for (const id in this.accounts) { // Loop through existing accounts to check for duplicates
            if (this.accounts[id].name === name) { // Check if the name already exists
                this.emit('error', `Account with name ${name} already exists.`); // Emit an error if it does
                return; // Exit the function if a duplicate is found
            }
        }

        if (!Number.isFinite(balance)) { // Check if the balance is a finite number
            this.emit('error', 'Initial balance must be a positive number'); // Emit an error if it is not
            return; // Exit the function if the balance is invalid

        }

        const personId = this.nextId++; // Generate a new unique identifier for the account
        this.accounts[personId] = { // Create a new account object and add it to the accounts array
            name, // Store the name of the account holder
            balance // Store the initial balance
        };
        return personId; // Return the unique identifier of the new account
    }

    handleAdd(personId, amount) { // Method to handle adding money to an account
        if (!Number.isFinite(amount)) { // Check if the amount is a finite number
            this.emit('error', 'Amount must be a positive number'); // Emit an error if it is not
            return; // Exit the function if the amount is invalid
        }

        this.accounts[personId].balance += amount; // Add the amount to the account balance
    }

    handleGet(personId, callback) { // Method to handle getting the balance of an account
        if (typeof callback !== 'function') { // Check if the callback is a function
            this.emit('error', 'Callback must be a function'); // Emit an error if it is not
            return; // Exit the function if the callback is invalid
        }

        callback(this.accounts[personId].balance); // Call the callback with the current balance of the account
    }

    handleWithdraw(personId, amount) { // Method to handle withdrawing money from an account
        if (!Number.isFinite(amount) || amount <= 0) { // Check if the amount is a finite number and greater than zero
            this.emit('error', 'Amount must be a positive number'); // Emit an error if it is not
            return; // Exit the function if the amount is invalid
        }
        const newBalance = this.accounts[personId].balance - amount; // Calculate the new balance after withdrawal
        if (newBalance < 0) { // Check if the new balance is negative
            this.emit('error', 'Insufficient funds'); // Emit an error if there are insufficient funds
            return; // Exit the function if there are insufficient funds
        }
        this.accounts[personId].balance = newBalance; // Update the account balance
    }

    handleSend(fromId, toId, amount) { // Method to handle sending money from one account to another

        if (!this.accounts[fromId]) { // Check if the sender's account exists
            this.emit('error', `Sender account with ID ${fromId} does not exist`); // Emit an error if it does not exist
            return; // Exit the function if the sender's account does not exist
        }

        if (!this.accounts[toId]) { // Check if the recipient's account exists
            this.emit('error', `Recipient account with ID ${toId} does not exist`); // Emit an error if it does not exist
            return; // Exit the function if the recipient's account does not exist
        }

        if (fromId === toId) { // Check if the sender and recipient are the same
            this.emit('error', 'Sender and recipient cannot be the same'); // Emit an error if they are the same
            return; // Exit the function if they are the same
        }

        if (!Number.isFinite(amount) || amount <= 0) { // Check if the amount is a finite number and greater than zero
            this.emit('error', 'Amount to send must be a positive number'); // Emit an error if it is not
            return; // Exit the function if the amount is invalid
        }

        if (this.accounts[fromId].balance < amount) { // Check if the sender has sufficient funds
            this.emit('error', 'Insufficient funds for transfer'); // Emit an error if there are insufficient funds
            return; // Exit the function if there are insufficient funds
        }

        this.accounts[fromId].balance -= amount; // Deduct the amount from the sender's balance
        this.accounts[toId].balance += amount; // Add the amount to the recipient's balance
    }

}

const bank = new Bank();

bank.on('error', (error) => {
    console.error('Error:', error);
});

const personFirstId = bank.register({
    name: 'Pitter Black',
    balance: 100,
});
const personSecondId = bank.register({
    name: 'Oliver White',
    balance: 700,
});

bank.emit('send', personFirstId, personSecondId, 50);

bank.emit('get', personSecondId, (balance) => {
    console.log(`I have $${balance}`); // I have $750
});

bank.emit('get', personFirstId, (balance) => {
    console.log(`I have $${balance}`); // I have $50
});

bank.emit('send', personFirstId, 999, 50); // error: recipient does not exist
bank.emit('send', 999, personSecondId, 50); // error: sender does not exist
bank.emit('send', personFirstId, personFirstId, 50); // error: sender and recipient are the same
bank.emit('send', personFirstId, personSecondId, -50); // error: amount must be positive
bank.emit('send', personFirstId, personSecondId, 1000); // error: insufficient funds for transfer