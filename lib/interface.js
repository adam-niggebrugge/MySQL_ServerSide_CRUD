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
            'View Employees',
            'View All Roles',
            'Add New Role',
            'Update Role', 
            'View All Departments',
            'Add Department',
            'Quit'
        ]
    }
]


async function init() {
     inquirer
        .prompt(menuChoices)
        .then((actionChoice) => {
        selectQuery(actionChoice.query);
    })
}

async function selectQuery(choice){
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
        case 'View Employees':
            viewEmployees();
            break;
        case 'Quit':
            process.exit();
        default:
            console.log(`Not clear what has caused this condition to trigger, this was sent: ${choice}`);
            init();
            break;
    }
}

async function addEmployee(){

    init();
}

async function updateEmployeeRole(){
    init();
}

async function addDepartment(){
    init();
}

async function viewAllDepartments(){
    //Set the MySQL query, aliasing column names for "cleaner" look
    let sql = 'SELECT id AS "Dept No.", name AS "Department" FROM department';
    displayTableQuery(sql);    
};

/**
 * Set the MySQL query, aliasing column names for "cleaner" look
 * Returns a joined result of roles titles, ids and salary and the corresponding department name
 */
async function viewAllRoles(){
    let sql = 'SELECT r.id AS "Role No.", r.title AS "Title", r.salary AS "Starting Salary", d.name AS "Department"  FROM role AS r INNER JOIN department AS d ON r.department_id = d.id';
    displayTableQuery(sql);
}

/**
 * Return a joined table across employee, manager, roles and department
 */
async function viewEmployees(){
    //Iniitalize string for sql
    let sql = '';

    const getFilter = await inquirer.prompt(
       [
           {
            type: 'list',
            name: 'filter',
            message: 'Choose a filter to view Employees?',
            choices: [
                'All',
                'Only Managers',
                'Non-Managers',
                'By Department',
                'By Role',
                'Go Back'
            ]
           }
        ])
    // ).then((choice) => {
    
        //Depending User choice create a SQL statement
        switch(getFilter.filter){
            case 'Non-Managers':
                sql = 'SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id';
                break;
            case 'Only Managers':
                sql = 'SELECT m.id AS "Employee No.", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary" FROM manager AS m INNER JOIN role AS r ON r.id = m.role_id INNER JOIN department AS d ON d.id = r.department_id';
                break;
            case 'All':
                sql = 'SELECT * FROM (SELECT m.id AS "Employee No.", CONCAT(m.last_name, ", ", m.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", NULL AS "Manager Name" FROM manager AS m INNER JOIN role AS r ON r.id = m.role_id INNER JOIN department AS d ON d.id = r.department_id UNION ALL SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id ) AS union_result';
                break;
            case 'By Department':
                let departmentNames = [];
                console.log('--------------------------------------------');
                //query the database for the existing departments
               const promisedb = db.promise();
               const [depResults, Feilds] = await promisedb.query('SELECT name FROM department')
                for(let i = 0; i < depResults.length; i++){
                    departmentNames.push(depResults[i].name);
                };
                const depChoice = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department?',
                        choices: departmentNames
                    }
                ]);
                    sql = `SELECT * FROM (SELECT m.id AS "Employee No.", CONCAT(m.last_name, ", ", m.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", NULL AS "Manager Name" FROM manager AS m INNER JOIN role AS r ON r.id = m.role_id INNER JOIN department AS d ON d.id = r.department_id UNION ALL SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id ) AS union_result WHERE Department = '${depChoice.department}'`
                break;
            case 'By Role':
                let roleNames = [];
                const [roleResults, fields] = await db.promise().query('SELECT DISTINCT title FROM role')
                for(let i = 0; i < roleResults.length; i++){
                    roleNames.push(roleResults[i].title);
                };
                const roleChoice = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which department?',
                        choices: roleNames
                    }
                ])
                sql = `SELECT * FROM (SELECT m.id AS "Employee No.", CONCAT(m.last_name, ", ", m.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", NULL AS "Manager Name" FROM manager AS m INNER JOIN role AS r ON r.id = m.role_id INNER JOIN department AS d ON d.id = r.department_id UNION ALL SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id ) AS union_result WHERE Position = '${roleChoice.role}'`
                break;
            case 'Go Back':
                init();
                break;  
            default:
                console.log("An error has occurred. Returning to main menu.");
                init();
                break;     
        }
        if(typeof sql !== 'undefined'){
            displayTableQuery(sql);
        }     
}

/**
 * Function to display tables
 * @param {*} sentSql - string using SQL syntax for views
 */
async function displayTableQuery(sentSql){
    db.query(sentSql, (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        console.log(`------------------`);
        console.table(result);
        console.log(`------------------`);
        //cycle back to main selection choices
        init();
    }); 
}

init();


