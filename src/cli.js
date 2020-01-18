var inquirer = require('inquirer');
const process = require('process');
const path = require('path');
var taskController = require('./taskController');
var fileHandler = require('./fileHandler');

const task_1_filePath = 'task_1_filePath';
const task_2_filePath = 'task_2_filePath';
const task_3_filePath = 'task_3_filePath';

var questions = [
    {
        type: 'list',
        name: 'task',
        message: 'What task do you need? (Use arrow key to choose from below list)',
        choices: ['1. The Total Revenue, Cost and Profit for each region and item type',
            '2. Number of each Priority Orders for each Month.',
            '3. Average Time to ship (in days), and Number of Orders For Each Month with totals for each level',
            '4. Exit.'],
    }
];

// This function act as a CLI menu and read user input and execute chosen task
exports.ask = function (dataObj) {
    inquirer.prompt(questions).then(answers => {
        const userInput = answers.task;
        const inputArray = userInput.split('.');
        const choiceNumber = Number(inputArray[0]);

        // if user choose task 1
        if (choiceNumber === 1) {
            const jsonResult = taskController.getTotalRevenueCostProfit(dataObj);
            fileHandler.outputTaskResult(task_1_filePath, jsonResult);
            console.log('\n<<<<<<<<<\nOutput of task 1 have been written to file:  ' + process.cwd() + path.sep + task_1_filePath + ' \n>>>>>>>>>>>\n');
            exports.ask(dataObj);
        }
        // if user choose task 2
        else if (choiceNumber === 2) {
            const jsonResult = taskController.getPriority(dataObj);
            fileHandler.outputTaskResult(task_2_filePath, jsonResult);
            console.log('\n<<<<<<<<<\nOutput of task 2 have been written to file:  ' + process.cwd() + path.sep + task_2_filePath + ' \n>>>>>>>>>>>\n');
            exports.ask(dataObj);
        }
        // if user choose task 3
        else if (choiceNumber === 3) {
            const jsonResult = taskController.getTask3(dataObj);
            fileHandler.outputTaskResult(task_3_filePath, jsonResult);
            console.log('\n<<<<<<<<<\nOutput of task 3 have been written to file:  ' + process.cwd() + path.sep + task_3_filePath + ' \n>>>>>>>>>>>\n');
            exports.ask(dataObj);
        }
        // if user choose exit
        else if (choiceNumber !== 4) {
            console.log('Have a nice day. Bye!  :)');
        }
        else {
            console.log('bye');
        }
    });
}
