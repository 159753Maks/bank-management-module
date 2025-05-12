# Bank Management Module

A solution to the second task: **Bank Management Module**.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Methods](#api-methods)
- [Examples](#examples)
- [Expected Result](#expected-result)
- [Actual Result](#actual-result)
- [License](#license)

## Overview

This project implements a simple bank management system that allows users to:
- Register accounts with initial balances and optional transaction limits.
- Perform operations such as deposits, withdrawals, and transfers.
- Handle custom event-driven logic for error handling and account updates.

## Features

- Event-driven architecture for handling operations.
- Customizable transaction limits.
- Error handling with event emitters.
- Support for multiple accounts.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/159753Maks/bank-management-module.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bank-management-module
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the application, use the following commands:

- Run in production mode:
  ```bash
  npm start
  ```
- Run in development mode with live reload:
  ```bash
  npm run dev
  ```

## API Methods

### `register({ name, balance, limit })`
Registers a new account.

- **Parameters**:
  - `name` (string): The name of the account holder.
  - `balance` (number): The initial balance (must be positive).
  - `limit` (function | null): Optional function to define transaction limits.

- **Returns**: `personId` (number) - Unique ID of the created account.

---

### `emit('add', personId, amount)`
Adds money to an account.

- **Parameters**:
  - `personId` (number): The ID of the account.
  - `amount` (number): The amount to add (must be positive).

---

### `emit('withdraw', personId, amount)`
Withdraws money from an account.

- **Parameters**:
  - `personId` (number): The ID of the account.
  - `amount` (number): The amount to withdraw (must satisfy the limit).

---

### `emit('send', fromId, toId, amount)`
Transfers money between accounts.

- **Parameters**:
  - `fromId` (number): The sender's account ID.
  - `toId` (number): The recipient's account ID.
  - `amount` (number): The amount to transfer.

---

### `emit('get', personId, callback)`
Gets the balance of an account.

- **Parameters**:
  - `personId` (number): The ID of the account.
  - `callback` (function): A function to handle the balance.

---

### `emit('changeLimit', personId, limitCallback)`
Changes the transaction limit for an account.

- **Parameters**:
  - `personId` (number): The ID of the account.
  - `limitCallback` (function): A function defining the new limit.

## Examples

Here is an example of how to use the module:

```javascript
const bank = new Bank();

bank.on('error', (error) => {
    console.error('Error:', error);
});

const personId = bank.register({
    name: 'John Doe',
    balance: 500,
    limit: (amount) => amount < 100,
});

bank.emit('add', personId, 50);
bank.emit('get', personId, (balance) => {
    console.log(`Current balance: $${balance}`);
});
```

## Expected Result

When using the example code provided above, the following output is expected:

```
Current balance: $550
```

## Actual Result

After running the example code, the actual output is:

```
Current balance: $550
```

## License

This project is licensed under the [MIT License](LICENSE).