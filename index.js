const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);




function init() {
    runPrompts();
}



function runPrompts() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What do you want to do?',
            choices: ["view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add an employee",
                "add a role",
                "view employees by department",
                "delete a department",
                "delete a role",
                "delete an employee",
                "quit"]

        }
    ])
        .then(choice => {
            switch (choice.userChoice) {

                case 'view all departments':
                    showDepartments();
                    break;
                case 'view all roles':
                    showRoles();
                    break;
                case 'view all employees':
                    showEmployees();
                    break;
                case 'add a department':
                    addDepartment();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'view employees by department':
                    employeeDepartment();
                    break;
                case 'delete a department':
                    deleteDepartment();
                    break;
                case 'delete a role':
                    deleteRole();
                    break;
                case 'delete an employee':
                    deleteEmployee();
                    break;
                case 'quit':
                    return;
            }
        })

}

// function to show all departments 
const showDepartments = () => {

    const sql = `SELECT department.id, department.name AS department FROM department`;

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log('Showing all the departments...\n');
            console.table(rows);
            runPrompts();
        })
        .catch(error => {
            throw error;
        });

};


//function to show all roles
const showRoles = () => {

    const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id=department.id`;

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log('Showing all the roles...\n');
            console.table(rows);
            runPrompts();
        })
        .catch(error => {
            throw error;
        });

};



//function to show all employees
const showEmployees = () => {

    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,  ' ', manager.last_name) as Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log('Showing all the employees...\n');
            console.table(rows);
            runPrompts();
        })
        .catch(error => {
            throw error;
        });

};


// function to add a department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is name of department you want to add?',
        }
    ]).then(answers => {
        const sql = `INSERT INTO department (name)
            VALUES (?)`;

        connection.query(sql, answers.addDepartment, (err, result) => {
            if (err) {
                throw err;
            } else { console.log(answers.addDepartment + " is added to deparments") };
            showDepartments();
        })
    })
};

// function to add a role
const addRole = () => {
    const sql = `SELECT * FROM department`;

    connection.promise().query(sql)
        .then(([rows]) => {
            const departmentChoices = rows.map(({ id, name }) => ({
                name: name,
                value: id
            }));



            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'What is the department the new role belongs to?',
                    choices: departmentChoices
                },
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the role title?',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the role salary?',
                },
            ]).then(answers => {
                const roleSql = `INSERT INTO role SET ?`;
                connection.query(roleSql, answers, (err, result) => {
                    if (err) {
                        throw err;
                    } else { console.log(answers.role + " is added to roles") };
                    showRoles();
                })
            })
        })
        .catch(error => {
            throw error;
        });
};


// function to add an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
        },
        // {
        //     type: 'input',
        //     name: 'roleId ',
        //     message: 'What is the role ID?',
        // },
        // {
        //     type: 'input',
        //     name: 'managerId ',
        //     message: 'What is the manager ID?',
        // }
    ]).then(answers => {
        // get the answer out of the object
        const firstName = answers.firstName;
        const lastName = answers.lastName;
        // make a call to mysql to get all the available roles
        const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id=department.id`;

        connection.promise().query(sql)
            .then(([rows]) => {
                const roleChoice = rows.map(({ id, title }) => ({ name: title, value: id }))

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'choose the role the employee belongs to',
                        choices: roleChoice
                    }
                ])
                    .then(answers => {
                        const roleId = answers.role;

                        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,  ' ', manager.last_name) as Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;

                        connection.promise().query(sql)
                            .then(([rows]) => {
                                const managerChoice = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }))
                                managerChoice.unshift({ name: 'None', value: null });

                                inquirer.prompt([
                                    {
                                        type: 'list',
                                        name: 'manager_id',
                                        message: 'choose the manager the employee belongs to',
                                        choices: managerChoice
                                    }
                                ])
                                    .then(answers => {
                                        const employeeObj = {
                                            first_name: firstName,
                                            last_name: lastName,
                                            role_id: roleId,
                                            manager_id: answers.manager_id
                                        };

                                        const sql = `INSERT INTO employee SET ?`;

                                        connection.query(sql, employeeObj, (err, rows) => {
                                            if (err) {
                                                throw err;
                                            } else { console.log("New employee is added!") };
                                            showEmployees();

                                        })


                                    })
                                    .catch(error => {
                                        throw error;
                                    });
                            })

                    })
                    .catch(error => {
                        throw error;
                    });

            })
    })
};

//function to view employees by department
const employeeDepartment = () => {

    const sql = `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id=role.id
    LEFT JOIN department ON role.department_id=department.id`;
    connection.promise().query(sql)
        .then(([rows]) => {
            console.log('Showing all the employees by departments\n');
            console.table(rows);
            runPrompts();
        })
        .catch(error => {
            throw error;
        });

}


// //function to delete department
const deleteDepartment = () => {
    const sql = `SELECT * FROM department`;
    connection.query(sql, (err, data) => {

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'deptChoice',
                message: 'Which department you want to delete?',
                choices: dept
            }
        ]).then(choice => {
            const dept = choice.deptChoice;
            const deptSql = `DELETE FROM department WHERE id=?`;
            connection.query(deptSql, dept, (err, result) => {
                if (err) throw err;
                console.log("Successfully deleted!");

                showDepartments();
            })
        })
    }
    )
}

// //function to delete a role
const deleteRole = () => {
    const sql = `SELECT * FROM role`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        const role = data.map(({ title, id }) => ({ name: title, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'roleChoice',
                message: 'Which role you want to delete?',
                choices: role
            }
        ]).then(choice => {
            const role = choice.roleChoice;
            const roleSql = `DELETE FROM role WHERE id=?`;
            connection.query(roleSql, role, (err, result) => {
                if (err) throw err;
                console.log("Successfully deleted!");
                showRoles();
            });
        });
    });
};

// //function to delete an employee
const deleteEmployee = () => {
    const sql = `SELECT * FROM employee`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employChoice',
                message: 'Which role you want to delete?',
                choices: employees
            }
        ]).then(choice => {
            const employee = choice.employChoice;
            const employSql = `DELETE FROM employee WHERE id=?`;
            connection.query(employSql, employee, (err, result) => {
                if (err) throw err;
                console.log("Successfully deleted!");
                showEmployees();
            });
        });
    });
};

init();