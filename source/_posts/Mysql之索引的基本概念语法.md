title: Mysql之索引的基本概念语法
author: Gin
date: 2021-06-17 21:55:56
tags:
  - mysql
  - 索引
categories:
  - 后端
---
#### 1.Mysql中索引的概念
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MySQL索引的建立对于MySQL的高效运行是很重要的，索引可以大大提高MySQL的检索速度。打个比方，如果合理的设计且使用索引的MySQL是一辆兰博基尼的话，那么没有设计和使用索引的MySQL就是一个人力三轮车。创建索引时，你需要确保该索引是应用在SQL 查询语句的条件(一般作为 WHERE 子句的条件)。 实际上，索引也是一张表，该表保存了主键与索引字段，并指向实体表的记录。
###### 索引一般分为：主键索引、唯一索引、普通索引、全文索引、组合索引
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上面都在说使用索引的好处，但过多的使用索引将会造成滥用。因此索引也会有它的缺点：虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行INSERT、UPDATE和DELETE。因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件。建立索引会占用磁盘空间的索引文件。
#### 2.索引的基本创建，删除以及数据库表的修改
##### 单列索引的基本创建格式是：
CREATE （UNQIUE）INDEX +索引名称+ON+表名（列名（长度））
例如：create unique index ac on sys_user(account);
##### 修改表结构的方式创建索引：
ALTER TABLE+表名+ADD(UNIQUE) INDEX+索引名称(列名)
例如：alter table sys_user add unique index pa(password);
##### 或者也可以创建表的时候指明：
    CREATE TABLE sys_user(  
    id INT NOT NULL primary key,   
    account VARCHAR(16) NOT NULL,  
    password VARCHAR(32) NOT NULL,  
    INDEX ac (account (16))  
    );  
##### 删除索引的语法：
DROP INDEX 索引名称 ON 表 或者 alter table 表名 drop index 索引名; 
例如：drop index pa on sys_user;& alter table sys_user drop index pa;
##### 显示索引信息:
格式：SHOW INDEX FROM 表名;
SHOW INDEX FROM sys_user;
![image.png](../../../../images/post-images/10224563-2af9d972939f6a7a.png)


