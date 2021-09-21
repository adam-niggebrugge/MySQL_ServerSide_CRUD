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
                break;
            case 'Update Employee Role':
                break;
            case 'View All Roles':
                break;
            case 'Add New Role':
                break;
            case 'View All Departments':
                break;
            case 'Add Department':
                    break;
            case 'Quit':
                break;
            default:

        }
    }
}


module.exports = Interface;

