const inquirer = require('inquirer');
const db = require('../config/connection');
const tableDisplay = require('console.table');
const menuChoices = [
    {
        type: 'list',
        name: 'query',
        message: 'What would you like to do?',
        choices: [
            'Add Employee',
            'Update Employee Role',
            'View All Employees',
            'View All Roles',
            'Add New Role',
            // 'Change Role Department', 
            'View All Departments',
            'Add Department',
            'Quit'
        ]
    }
]


function init() {
     inquirer
        .prompt(menuChoices)
        .then((actionChoice) => {
        selectQuery(actionChoice.query);
    })
}

function selectQuery(choice){
    switch (choice) {
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'Add New Role':
            addNewRole();
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'Quit':
            process.exit();
        default:
            console.log(`Not clear what has caused this condition to trigger, this was sent: ${choice}`);
            init();
            break;
    }
}

// function addEmployee(){

//     init();
// }


function viewAllDepartments(){
    //Set the MySQL query, aliasing column names for "cleaner" look
    let sql = 'SELECT id AS "Dept No.", name AS "Department" FROM department';
    db.query(sql, (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        console.table(result);

        //cycle back to main selection choices
        init();
    });      
};

/**
 * Set the MySQL query, aliasing column names for "cleaner" look
 * Returns a joined result of roles titles, ids and salary and the corresponding department name
 */
function viewAllRoles(){
    let sql = 'SELECT r.id AS "Role No.", r.title AS "Title", r.salary AS "Starting Salary", d.name AS "Department"  FROM role AS r INNER JOIN department AS d ON r.department_id = d.id';
    db.query(sql, (err, result) => {
        console.table(result);

        //cycle back to main selection choices
        init();
    }); 
}

/**
 * Return a joined table across employee, manager, roles and department
 */
function viewAllEmployees(){
     let sql = 'SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id';
     db.query(sql, (err, result) => {
        console.table(result);

        //cycle back to main selection choices
        init();
    }); 
}


init();


