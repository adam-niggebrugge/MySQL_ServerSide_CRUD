const inquirer = require('inquirer');
const db = require('../config/connection');

console.log(db);

// class Interface {
   function init(){
        inquirer.prompt([
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
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ]
            }
        ]).then((actionChoice) => {
            console.log(`${actionChoice}`);
            selectQuery(actionChoice.query);
        });
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
    
// }

function addEmployee(){

    init();
}


function viewAllDepartments(){
    let sql = 'SELECT id AS "Dept No.", name AS "Department" FROM department';
    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            console.log(err);
            return;
        }
        
    });

    init();
}

function viewAllEmployees(){

    init();
}

init();

// module.exports = Interface;

