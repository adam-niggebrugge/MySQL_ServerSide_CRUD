USE humanResource_db;

INSERT INTO department (name)
VALUES   ("Sales")
 ,       ("Receiving")
 ,       ("Engineering")
 ,       ("Accounting")
 ,       ("Customer Service")
; 


INSERT INTO role (title, salary, department_id)
VALUES  
    ("Senior Consultant", 75000, (SELECT id FROM department WHERE name="Sales"))
 ,  ("Senior Consultant", 150000, (SELECT id FROM department WHERE name="Engineering"))
 ,  ("Senior Consultant", 125000, (SELECT id FROM department WHERE name="Customer Service"))
 ,  ("Lead Engineer", 90000, (SELECT id FROM department WHERE name="Engineering"))
 ,  ("Software Engineer", 65000, (SELECT id FROM department WHERE name="Engineering"))
 ,  ("Accounts Receivable", 38000, (SELECT id FROM department WHERE name="Accounting"))
 ,  ("Accounts Payable", 40000, (SELECT id FROM department WHERE name="Accounting"))
 ,  ("Customer Representative", 45000, (SELECT id FROM department WHERE name="Customer Service"))
 ,  ("Manager", 120000, (SELECT id FROM department WHERE name="Customer Service"))
 ,  ("Stocker", 32000, (SELECT id FROM department WHERE name="Receiving"))
 ,  ("Manager", 52000, (SELECT id FROM department WHERE name="Receiving"))
 ,  ("Manager", 135000, (SELECT id FROM department WHERE name="Engineering"))
 ,  ("Manager", 165000, (SELECT id FROM department WHERE name="Accounting"))
 ,  ("Manager", 180000, (SELECT id FROM department WHERE name="Sales"))
 ;



-- seed managers

INSERT INTO manager (id, first_name, last_name, role_id)
VALUES  
    (1001,"Ella","Fine", (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Customer Service")))
;

INSERT INTO manager (first_name, last_name, role_id)
VALUES  
    ("Ella","Dog", (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving")))
,   ("Rachel","Meow", (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Engineering")))
,   ("Meredith","Fine", (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Accounting")))
,   ("Rachel","Cat", (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Sales")))
;



-- after managers seeded give them employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
   ("Adam","Nick", (SELECT id FROM role WHERE title = "Senior Consultant" AND department_id = (SELECT id FROM department WHERE name="Sales")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Sales"))))
,   ("Anthony","Sole", (SELECT id FROM role WHERE title = "Senior Consultant" AND department_id = (SELECT id FROM department WHERE name="Customer Service")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Customer Service"))))
,   ("Matt","Meyer", (SELECT id FROM role WHERE title = "Senior Consultant" AND department_id = (SELECT id FROM department WHERE name="Engineering")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Engineering"))))

,   ("Gregory","Cat", (SELECT id FROM role WHERE title = "Lead Engineer" AND department_id = (SELECT id FROM department WHERE name="Engineering")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Engineering"))))
,   ("Appa","Cat", (SELECT id FROM role WHERE title = "Software Engineer" AND department_id = (SELECT id FROM department WHERE name="Engineering")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Engineering"))))
,   ("Spock","Frog", (SELECT id FROM role WHERE title = "Software Engineer" AND department_id = (SELECT id FROM department WHERE name="Engineering")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Engineering"))))

,   ("Isaak","Baby", (SELECT id FROM role WHERE title = "Accounts Receivable" AND department_id = (SELECT id FROM department WHERE name="Accounting")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Accounting"))))
,   ("AJ","Store", (SELECT id FROM role WHERE title = "Accounts Receivable" AND department_id = (SELECT id FROM department WHERE name="Accounting")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Accounting"))))
,   ("Erik","Son", (SELECT id FROM role WHERE title = "Accounts Payable" AND department_id = (SELECT id FROM department WHERE name="Accounting")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Accounting"))))

,   ("Sarah","Fields", (SELECT id FROM role WHERE title = "Customer Representative" AND department_id = (SELECT id FROM department WHERE name="Customer Service")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Sales"))))
,   ("Ryan","Fields", (SELECT id FROM role WHERE title = "Customer Representative" AND department_id = (SELECT id FROM department WHERE name="Customer Service")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Sales"))))
,   ("Derek","Lettuce", (SELECT id FROM role WHERE title = "Customer Representative" AND department_id = (SELECT id FROM department WHERE name="Customer Service")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Sales"))))

,   ("Sarah","Meadows", (SELECT id FROM role WHERE title = "Stocker" AND department_id = (SELECT id FROM department WHERE name="Receiving")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving"))))
,   ("Sara","Brooks", (SELECT id FROM role WHERE title = "Stocker" AND department_id = (SELECT id FROM department WHERE name="Receiving")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving"))))
,   ("Arnold","Forest", (SELECT id FROM role WHERE title = "Stocker" AND department_id = (SELECT id FROM department WHERE name="Receiving")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving"))))
,   ("Hoteph","Woods", (SELECT id FROM role WHERE title = "Stocker" AND department_id = (SELECT id FROM department WHERE name="Receiving")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving"))))
,   ("George","Feilds", (SELECT id FROM role WHERE title = "Stocker" AND department_id = (SELECT id FROM department WHERE name="Receiving")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving"))))
,   ("Leon","Desert", (SELECT id FROM role WHERE title = "Stocker" AND department_id = (SELECT id FROM department WHERE name="Receiving")), (SELECT id FROM manager WHERE role_id = (SELECT id FROM role WHERE title = "Manager" AND department_id = (SELECT id FROM department WHERE name="Receiving"))))
;