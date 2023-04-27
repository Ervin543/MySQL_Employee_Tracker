const inquirer = require('inquirer');
const db = require('./db/connection');
menu()
function menu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ],
            name: 'menuChoice'
        }
    ]).then(response => {
        switch (response.menuChoice) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
        }
    });
}



// View all departments
function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
}

// View all roles
function viewRoles() {
    db.query(`SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id`, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
}

// View all employees
function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    });
}

// Add a department
function addDepartment() {
    inquirer.prompt([
        {
            message: 'Enter the name of the new department:',
            name: 'departmentName'
        }
    ]).then(response => {
        db.query(`INSERT INTO department (name) VALUES (?)`, response.departmentName, (err, res) => {
            if (err) throw err;
            console.log(`${response.departmentName} has been added to the database.`);
            menu();
        });
    });
}

// Add a role
function addRole() {
    inquirer.prompt([
        {
            message: 'Enter the name of the new role:',
            name: 'roleTitle'
        },
        {
            message: 'Enter the salary for this role:',
            name: 'roleSalary'
        },
        {
            type: 'list',
            message: 'Which department does this role belong to?',
            choices: ['Engineering', 'Human Resources'],
            name: 'departmentName'
        }
    ]).then(response => {
        let departmentId;
        if (response.departmentName === 'Engineering') {
            departmentId = 1;
        } else {
            departmentId = 2;
        }
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [response.roleTitle, response.roleSalary, departmentId], (err, res) => {
            if (err) throw err;
            console.log(`${response.roleTitle} has been added to the database.`);
            menu();
        });
    });
}

// Add an employee
function addEmployee() {
    inquirer.prompt([
        {
            message: 'Enter the employee\'s first name:',
            name: 'firstName'
        },
        {
            message: 'Enter the employee\'s last name:',
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'What is the employee\'s role?',
            choices: ['Senior Engineer', 'Typist'],
            name: 'roleTitle'
        },
        {
            message: 'Who is the employee\'s manager? (Enter the manager\'s ID or leave blank if the employee does not have a manager)',
            name: 'managerId'
        }
    ]).then(response => {
        let roleId;
        if (response.roleTitle === 'Senior Engineer') {
            roleId = 1;
        } else {
            roleId = 2;
        }

        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        db.query(query, [response.firstName, response.lastName, roleId, response.managerId], (err, res) => {
            if (err) throw err;
            console.log(`Employee ${response.firstName} ${response.lastName} has been added!`);
            menu();
        });
    })
};


function updateEmployeeRole() {
    let employees = [];
    let roles = [];
    db.query(`select * from employee`, (err, res) => {
      if (err) throw err;
      employees = res.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
      db.query(`select * from role`, (err, res) => {
        if (err) throw err;
        roles = res.map(role => ({ name: role.title, value: role.id }));
        inquirer.prompt([
            {
              type: 'list',
              name: 'employee',
              message: 'Which employee would you like to update?',
              choices: employees
            },
            {
              type: 'list',
              name: 'role',
              message: 'What is the employee\'s new role?',
              choices: roles
            }
          ]).then(response => {
            const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.query(query, [response.role, response.employee], (err, res) => {
              if (err) throw err;
              console.log(`Employee's role has been updated!`);
              menu();
            });
          });
          
      });
    });
  }
  