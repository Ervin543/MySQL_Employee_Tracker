const inquirer = require('inquirer');
const db = require('./db/connection');

function menu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'what would you like to do ?',
            choices: ['view all departments','view all roles','view all employees','add a department','add a role','add an employee',"update an employee's role"],
            name:'menu'
        }
    ]).then (response =>{
        if (response.menu=='view all departments'){
            viewDepartments()
        }else if (response.menu == 'view all roles'){
            viewRoles()
        }else if (response.menu == 'view all employees'){
            viewEmployees()
        }else if (response.menu == 'add a department'){
            addDepartment()
        }else if (response.menu == 'add a role'){
            addRole()
        }else if (response.menu == 'add an employee'){
            addAnEmployee()
        }else if (response.menu == "update an employee's role"){
            updateEmployeeRole()
        }
    })

}

function viewDepartments() {
    db.query(`select * from department`, (err,res) => {
        if (err) throw err
        console.table(res)
        menu()
    })
}

function viewRoles() {
    db.query(`select * from role`, (err,res) => {
        if (err) throw err
        console.table(res)
        menu()
    })
}

function viewEmployees() {
    db.query(`select * from employee`, (err,res) => {
        if (err) throw err
        console.table(res)
        menu()
    })
}
function addDepartment() {
    inquirer.prompt([
        {
            message: 'enter a department name',
            name: 'name',

        }
    ]).then(response => {
        db.query(`insert into department(name) values ('${response.name}')`, (err,res) => {
            if (err) throw err
            console.table(res)
            menu()
        })
    })
}

function addRole() {
    
}

function addAnEmployee() {
    
}

function updateEmployeeRole() {
    
}

menu();