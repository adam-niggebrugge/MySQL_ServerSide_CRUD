const inquirer = require('inquirer');
const db = require('../config/connection');
const tableDisplay = require('console.table');

//Expect { id: int, name: string}
const depObjArray = [];
//Expect { id: int, name: string ( expect concat first and last name out of SQL)}
const empObjArray = [];
//Expect { id: int, name: string ( expect concat first and last name out of SQL)}
const magObjArray = [];
//Expect { id: int, title: string}
const rolObjArray = [];

const promisedb = db.promise();
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

/**
 * 
 * @param {*} object object being transversed
 * @param {*} key  string to key off
 * @param {*} find0  string to compare value to find
 * @param {*} find1  optional compare two values
 * 
 * returns an index, -1 if key not applicable or find value fails
 */
function indexFinder(object, key, find0, find1){
    let index;
    switch (key){
        case 'name':
            object.find((instance, i) => {
                if(instance.name == find0){
                    index = i;
                } 
            });
            return object[index].id;
        case 'title':
            object.find((instance, i) => {
                if(instance.title == find0)
                    index = i;
            });
            return object[index].id;
        case 'name, title':
            object.find((instance, i) => {
                if(instance.name == find0 && instance.title == find1)
                    index = i;
            });
            return object[index].id;
        default:
            return -1;
    }
}
/**
 * Unwrap MySQL result set objects into JSON for easier use in program
 * @param {*} rewrappedObj - object to be mutated with JSON structuring, column names become keys
 * @param {*} objSQL result set, can be multiple columns or single column. 
 */
function objectFiller(rewrappedObj, objSQL){
    for(let i = 0; i < objSQL.length; i++){
        let tempRowResult = '';
        //convert to string that JSON can read
        // console.log(objSQL[i]);
        tempRowResult = (JSON.stringify(objSQL[i]));
        // console.log(tempRowResult);
        // console.log(JSON.parse(tempRowResult));
        //unwrap object with JSON
        rewrappedObj.push(JSON.parse(tempRowResult));
    };
}

//INitial App
async function init() {
    //Preload arrays that require choices.
    
    //query the database for the existing departments
    const [depResults, Fields] = await promisedb.query('SELECT id, name FROM department')
    //Iterate through result set to retain a local array for quick choices to display to user concerning departments
    objectFiller(depObjArray, depResults);
    const [empResults, Fields1] = await promisedb.query('SELECT id, CONCAT(last_name, ", ", first_name) AS name FROM employee');
    objectFiller(empObjArray, empResults);
    const [mangResults, Fields2] = await promisedb.query('SELECT id,  CONCAT(last_name, ", ", first_name) AS name FROM manager');
    objectFiller(magObjArray, mangResults);
    const [rolResults, Fields3] = await promisedb.query('SELECT r.id, r.title, r.department_id, d.name FROM role AS r JOIN department AS d ON r.department_id = d.id');
    objectFiller(rolObjArray, rolResults);

    MainMenu();
}

async function MainMenu(){
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
            MainMenu();
            break;
    }
}

async function addEmployee(){
    let departmentNames = [];
    let roleTitles = [];
    let sql = '';
    let departmentId;
    //let roleID;
    try{

        for(let i = 0; i < depObjArray.length; i++){
            departmentNames.push(depObjArray[i].name);
        };
        const depChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department will the employee work in?',
                choices: departmentNames
            }
        ]);

        departmentId = indexFinder(depObjArray, 'name', depChoice.department);

        const [deptRoleResults, deptFields] = await promisedb.query(`SELECT title FROM role WHERE department_id = ${departmentId}`);
            for(let i = 0; i < deptRoleResults.length; i++){
                roleTitles.push(deptRoleResults[i].title);
            };
        
        const roleChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'What position will the employee work?',
                choices: roleTitles
            }
        ])
        const employeeAdded = await inquirer.prompt([
                {
                type: 'input',
                name: 'first_name',
                message: 'What is the employee\'s first name?',
                validate: answer => {
                if (answer !== '') {
                    return true;
                }
                return 'The employee\'s first name must be representated by at least one character.';
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the employee\'s last name?',
                validate: answer => {
                if (answer !== '') {
                    return true;
                }
                return 'The employee\'s last name must be representated by at least one character.';
                }
            }
        ]);

        if(roleChoice.role == "Manager"){
            sql = `INSERT INTO manager (first_name, last_name, role_id) VALUES ("${employeeAdded.first_name}", "${employeeAdded.last_name}", (SELECT id FROM role WHERE title = "Manager" AND department_id = ${departmentId}))`;
            updateTableQuery(sql, "Manager");
        } else {
            sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employeeAdded.first_name}", "${employeeAdded.last_name}", (SELECT id FROM role WHERE title = "${roleChoice.role}" AND department_id = ${departmentId}), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = ${departmentId})))`;
            updateTableQuery(sql, "Employee");
        }
    }
    catch{
        console.log("Failed to insert employee. Returning to main menu.");
        MainMenu();
    }
}

async function updateEmployeeRole(){
    let sql = '';
    let employeeNames = [];
    let roleNames = [];
    let empID = -1;
    let rolID = -1;
    try{
        console.log(empObjArray);

        for(let i = 0; i < empObjArray.length; i++){
            employeeNames.push(empObjArray[i].name);
        }; 

        const employeeAltered = await inquirer.prompt([
            {
            type: 'list',
            name: 'employee',
            message: 'Which Employee\'s Role is being changed?',
            choice: employeeNames
        }]);

        empID = indexFinder(empObjArray, 'name', employeeAltered.employee);
        
        console.log(rolObjArray)
        for(let i = 0; i < rolObjArray.length; i++){
            console.log(`what does this look like? ${rolObjArray[i].name}, ${rolObjArray[i].title}`)
            roleNames.push(`${rolObjArray[i].name}, ${rolObjArray[i].title}`);
        }; 

        const newRole = await inquirer.prompt([
            {
            type: 'list',
            name: 'changeRole',
            message: 'Which Employee\'s Role is being changed?',
            choice: roleNames
        }]);
        console.log(newRole.changeRole);
        
        rolID = indexFinder(rolObjArray, 'name, title', newRole.changeRole);


        sql = `UPDATE employee SET (name) WHERE id = empID ("${departmentAdded.department}")`;
        updateTableQuery(sql, 'Employee');
        
    } catch {
        console.log('Failed to update employee role. Returing to main menu');
        MainMenu();
    }

}

async function addDepartment(){
    let sql = '';

    try{
        const departmentAdded = await inquirer.prompt([
            {
            type: 'input',
            name: 'department',
            message: 'What is the name of the Department?',
            validate: answer => {
            if (answer !== '') {
                return true;
            }
            return 'The Department name must be representated by at least one character!';
            }
        }]);
        sql = `INSERT INTO department (name) VALUES ("${departmentAdded.department}")`;
        updateTableQuery(sql, 'Department');
        
    } catch {
        console.log('Failed to insert Department. Returing to main menu');
        MainMenu();
    }
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
        //Depending User choice create a SQL statement
        switch(getFilter.filter){
            case 'Non-Managers':
                sql = 'SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id';
                break;
            case 'Only Managers':
                sql = 'SELECT m.id AS "Employee No.", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary" FROM manager AS m INNER JOIN role AS r ON r.id = m.role_id INNER JOIN department AS d ON d.id = r.department_id';
                break;
            case 'All':
                //Union of tables with unequal collumns can be solved by casting the extra columns as NULL
                sql = 'SELECT * FROM (SELECT m.id AS "Employee No.", CONCAT(m.last_name, ", ", m.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", NULL AS "Manager Name" FROM manager AS m INNER JOIN role AS r ON r.id = m.role_id INNER JOIN department AS d ON d.id = r.department_id UNION ALL SELECT e.id AS "Employee No.", CONCAT(e.last_name, ", ", e.first_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", r.salary AS "Salary", CONCAT(m.last_name, ", ", m.first_name) AS "Manager Name" FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id INNER JOIN manager AS m ON m.id = e.manager_id ) AS union_result';
                break;
            case 'By Department':
                let departmentNames = [];
                
                for(let i = 0; i < depObjArray.length; i++){
                    departmentNames.push(depObjArray[i].name);
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

                for(let i = 0; i < rolObjArray.length; i++){
                    roleNames.push(rolObjArray[i].title);
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
                MainMenu();
                break;  
            default:
                console.log("An error has occurred. Returning to main menu.");
                MainMenu();
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
        MainMenu();
    }); 
}


/**
 * Function to display tables
 * @param {*} sentSql - string using SQL syntax for views
 */
 async function updateTableQuery(sentSql, table){
    db.query(sentSql, (err, result) => {
        if(err){
            console.error(err);
            return;
        }
        console.log(`------------------`);
        console.log(`${table} has been UPDATED!!`);
        console.log(`------------------`);
        //cycle back to main selection choices
        MainMenu();
    }); 
}

init();