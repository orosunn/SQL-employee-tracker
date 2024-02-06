const mysql = require('mysql2');
const inquirer = require ('inquirer');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'or07oi$',
    database: 'employee_tracker'
  },
  console.log(`Connected to the employee_tracker database.`)
);

function init(){
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'user_choice',
      message: 'Select operation to perform',
      choices: ['view all employees', 'view all roles'],
    },
  ])
  .then(answers => {
    console.info('Answer:', answers.user_choice);
    if (answers.user_choice === "view all employees"){
      getAllEmployees()
    }
    else if(answers.user_choice === "view all roles"){

    } //calls to other functions
  });
};

function getAllEmployees(){

};

init();