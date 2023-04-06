insert into department(name) 
values ('human resources'), ('engineering');

insert into role(title, salary, department_id)
values ('senior engineer',25000,2), ('typist', 20000,1);

insert into employee(first_name,last_name,role_id,manager_id)
values ('joe','schmoe',1,null), ('john','hacker',2,null);


