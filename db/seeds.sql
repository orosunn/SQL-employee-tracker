INSERT INTO department (department_name)
VALUES ("Accounts"),
       ("Marketing"),
       ("Agile"),
       ("Technology");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 60000, 1),
       ("Marketer", 70000, 2),
       ("Agile Specialist", 50000, 3),
       ("Tech Expert", 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Merrick", 1, NULL),
       ("Phil", "West", 2, NULL),
       ("Mark", "Smith", 3, 1),
       ("Bob", "Wright", 4, 2);