#! /usr/bin/env node
import inquirer from 'inquirer'

// a better way to do this would be to read/write or update a json file to better simulate a real life experience
interface User {
    userID: string;
    userPIN: string;
    balance: number;
}

const generateRandomUser = (): User => {
    const userID = Math.random().toString(36).substring(7);
    const userPIN = Math.floor(1000 + Math.random() * 9000).toString();
    const balance = Math.floor(1000 + Math.random() * 9000);

    return { userID, userPIN, balance };
};

const user1: User = {
    userID: 'M. Talha',
    userPIN: '4321',
    balance: Math.floor(1000 + Math.random() * 9000)
}

console.log('Welcome to MTS ATM! The soultion to all your financial worries.\n');

const atmScreen = () => {
    
    return inquirer.prompt([
        {
            type: 'input',
            name: 'userID',
            message: 'Enter User ID: '
        },
        {
            type: 'password',
            name: 'userPIN',
            message: 'Enter User PIN: ',
            mask:'*'
        }
    ])
}

const depWithBalEx = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'deposit_or_withdraw',
            message: 'Do you want to check your Balance or Deposit/Withdraw cash or Exit: ',
            choices: ['Check Balance', 'Deposit', 'Withdraw', 'Exit']
        }
    ])
}

const depositAmount = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'deposit_amount',
            message: 'Enter the amount you want to Deposit WITHOUT currency sign: ',
            validate: (moneyVal) => {
                const isValid = !isNaN(moneyVal)
                return isValid || 'Please enter a valid number'
            }
        }
    ])
}

const withdrawAmount = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'withdraw_amount',
            message: 'Enter the amount you want to Withdraw WITHOUT currency sign: ',
            validate: (moneyVal) => {
                const isValid = !isNaN(moneyVal)
                return isValid || 'Please enter a valid number'
            }
        }
    ])
}

const deposit = (user: User, amount: number) => {user.balance += amount}
const withdraw = (user: User, amount: number) => {user.balance -= amount}

const launchATM: () => any = async () => {
    try {
        const answers = await atmScreen()
        const {userID, userPIN} = answers

        const user = user1    // to check ATM we used a predefined user. Otherwise we just need to call generateRandomUser here.
        if (userID == user.userID && userPIN == user.userPIN) {
            console.log('\nSuccessfully Logged In!\n');
            
            const continueOrExit: any = async () => {
                const decision = await depWithBalEx()

                if (decision.deposit_or_withdraw == 'Exit') {
                    return console.log('Thank You for using MTS ATM! We hope to see you again.')

                } else if (decision.deposit_or_withdraw == 'Deposit') {
                    const amount = await depositAmount()
                    deposit(user, +amount.deposit_amount)
                    console.log(`Successfuly deposited amount Rs. ${amount.deposit_amount}\n\nCurrent Balance: ${user.balance}\n`);

                    return continueOrExit()
                    
                } else if (decision.deposit_or_withdraw == 'Check Balance') {
                    console.log(`User ID: ${user.userID}\nUser Balance: Rs. ${user.balance}\n`);

                    return continueOrExit()

                } else {
                    const amount = await withdrawAmount()
                    withdraw(user, +amount.withdraw_amount)
                    console.log(`Successfuly withdrew amount Rs. ${amount.withdraw_amount}\n\nRemaining Balance: ${user.balance}\n`);

                    return continueOrExit()
                }
            }
            
            return continueOrExit()
        }
        console.error('\nInvalid User Credentials')
        return launchATM()

    } catch (error: any) {
        if (error.isTtyError) {
            console.error("Prompt couldn't be rendered in the current environment");

          } else {
            console.error("Error during user input:", error.message);
          }
    }
}

launchATM()