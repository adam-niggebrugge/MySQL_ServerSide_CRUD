const inquirer = require('inquirer');

class Interface {
    init(){
        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'query',
                message: 'What would you like to do?',
                choices: [
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add New Role', 
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ]
            }
        ]).then((actionChoice) => {
            selectQuery(actionChoice.query);
    });

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
            case 'Quit':
                return;
            default:
                console.log(`Not clear what has caused this condition to trigger, this was sent: ${choice}`);
                init();
                break;
            }
        }
    }
}


module.exports = Interface;

