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

        const personId = args[0]; // Extract the personId from the arguments
        if (!this.accounts[personId]) { // Check if the personId exists in the accounts array
            this.emit('error', `Account with ID ${personId} does not exist.`); // If not, emit an error event
            return; // Exit the function if the account does not exist
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
            default:
                this.emit('error', `Unknown event: ${eventName}`); // Emit an error for unknown event types
        }
    }

} 