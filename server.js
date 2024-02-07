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
      choices: ['View all employees', 'View all roles', 'View all departments', 'Add a department', 'Add a role', 'Add an employee', 'Update An employee role']
    },
  ])
  .then(answers => {
    console.info('Answer:', answers.user_choice);
    if (answers.user_choice === "View all employees"){
      return getAllEmployees()
    }
    else if(answers.user_choice === "View all roles"){
      return getAllRoles();
    } 
    else if(answers.user_choice === "View all departments"){
      return getAllDepartments();
    }
    else if(answers.user_choice === "Add a department"){
      return addDepartment();
    }
    else if(answers.user_choice === "Add a role"){
      return addRole();
    }
    else if(answers.user_choice === "Add an employee"){
      return addEmployee();
    }
    else if(answers.user_choice === "Update An employee role"){
      return updateEmployee();
    }
  });
};

function getAllEmployees(){
  db.query('SELECT * FROM employee', (err, results) => {
    if(err) {
      console.error(err);
      return
    }
    console.table(results);
    init();
  })
};

function getAllRoles(){
  db.query('SELECT * FROM role', (err, results) => {
    if(err) {
      console.error(err);
      return
    }
    console.table(results);
    init();
  })
};

function getAllDepartments(){
  db.query('SELECT * FROM department', (err, results) => {
    if(err) {
      console.error(err);
      return
    }
    console.table(results);
    init();
  })
};

function addDepartment(){
  inquirer.prompt(questions = [
    {
      type:'input',
      message:'Please enter department name',
      name:'addDepartment'
    }]).then(answers => {
      const params = [answers.addDepartment]
      db.query('INSERT INTO department (department_name) VALUES (?)', params, (err, results) =>{
        if (err) {
          console.error(err);
          return
        }
        console.log(`Department ${params} added!`);
        init()
      })
    })
};

function addEmployee() {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    const roleChoices = results.map(role => ({
      name: role.title,
      value: role.id,
    }))
    inquirer.prompt(questions = [
      {
        type: 'input',
        message: 'Please enter the employees first name',
        name: 'first_Name'
      },
      {
        type: 'input',
        message: 'Please enter the employees last name',
        name: 'last_Name'
      },
      {
        type: 'list',
        message: 'Please select the employees role',
        choices: roleChoices,
        name: 'whichRole'
      }]).then(answers => {
        const { first_Name, last_Name, whichRole } = answers;

        db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [first_Name, last_Name, whichRole], (employeeErr, employeeResults) => {
          if (employeeErr) {
            console.error(employeeErr);
            return
          }
          console.log(`Employee ${first_Name} ${last_Name} added with role of ${whichRole}`);
          init();
        })
      })
  })
};

function addRole() {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    const departmentChoices = results.map(department => department.department_name);
    inquirer.prompt(questions = [
      {
        type: 'input',
        message: 'Please enter a new role',
        name: 'addRole'
      },
      {
        type: 'input',
        message: 'What is the salary?',
        name: 'addSalary'
      },
      {
        type: 'list',
        message: 'Which department is the role part of?',
        choices: departmentChoices,
        name: 'whichDepartment'
      }]).then(answers => {
        const { addRole, addSalary, whichDepartment } = answers;

        const departmentChosen = results.find(department => department.department_name === whichDepartment);
        if (!departmentChosen) {
          console.error('No department found')
          return;
        }
        const inDepartment = departmentChosen.id;
        const newRole = [addRole, addSalary, inDepartment];
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', newRole, (roleErr, roleResults) => {
          if (roleErr) {
            console.error(roleErr);
            return
          }
          console.log(`Role ${addRole} added with salary of ${addSalary} in ${inDepartment} department!`);
          init();
        })
      })
  })
};

function updateEmployee() {
  db.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    const employeeChoices = results.map(employee => ({
      name: employee.first_name,
      value: employee.id
    }));
    db.query('SELECT * FROM role', (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      const roleChoices = results.map(role => ({
        name: role.title,
        value: role.id,
      }));
      inquirer.prompt(questions = [
        {
          type: 'list',
          message: 'Please select an employee',
          choices: employeeChoices,
          name: 'whichEmployee'
        },
        {
          type: 'list',
          message: 'Please select a role',
          choices: roleChoices,
          name: 'whichRole'
        }]).then(answers => {
          const { whichEmployee, whichRole } = answers;

          db.query('UPDATE employee SET role_id = ? WHERE id = ?', [whichRole, whichEmployee], (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return;
            }
            console.log(`Employee ${whichEmployee} updated to role of ${whichRole}`);
            init();
          })
        })
    })
  })  
};

init();