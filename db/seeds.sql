USE employees_db;

INSERT INTO department (name)
VALUES ("Engineer"),
       ("Finance"),
       ("Legal"),
       ("Accounting");

       INSERT INTO role (title,salary,department_id)
VALUES ("Senior Engineer", 100000, 1),
        ("Junior Engineer", 60000, 1),
       ("Finance Director", 120000, 2),
       ("Finance Intern", 50000, 2),
       ('Account Manager', 110000, 3),
        ('Accountant', 90000, 3),
       ("Sales Manager", 110000, 4),
       ("Sales",90000, 4);
       
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES  ('Jackie', 'Petit', 1, NULL),
    ('Max', 'Gonzales', 2, 1),
    ('Calvin', 'Kim', 3, NULL),
    ('Yukata', 'Mikoto', 4, 3),
    ('Maria', 'Longwood', 5, NULL),
   ('Andrew', 'Romans', 6, 5),
    ('Julius', 'Thomas', 7, NULL),
    ('Sari', 'Rasa', 8, 7);