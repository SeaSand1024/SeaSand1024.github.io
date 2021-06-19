title: MySQL中exists和in的区别及使用场景
author: Gin
tags:
  - mysql
  - SQL
categories:
  - 后端
date: 2021-06-17 21:35:00
---
>1.对B查询涉及id，使用索引，故B表效率高，可用大表 -->外小内大
select * from A where exists (select * from B where A.id=B.id);

>2.对A查询涉及id，使用索引，故A表效率高，可用大表 -->外大内小
select * from A where A.id in (select id from B);

##### 1. exists是对外表做loop循环，每次loop循环再对内表（子查询）进行查询，那么因为对内表的查询使用的索引（内表效率高，故可用大表），而外表有多大都需要遍历，不可避免（尽量用小表），故内表大的使用exists，可加快效率；

##### 2. in是把外表和内表做hash连接，先查询内表，再把内表结果与外表匹配，对外表使用索引（外表效率高，可用大表），而内表多大都需要查询，不可避免，故外表大的使用in，可加快效率。

##### 3. 如果用not in ，则是内外表都全表扫描，无索引，效率低，可考虑使用not exists，也可使用A left join B on A.id=B.id where B.id is null 进行优化。

　　此外，新近遇到的坑，mysql版本问题：

　　MySQL版本问题：5.6.5优化了子查询，引入物化子查询(针对where clause的subquery)，子查询物化将子查询结果存入临时表，确保子查询只执行一次，该表不记录重复数据且采用哈希索引查找;

而之前的版本则会把非相关子查询转化为相关子查询，导致效率低下（尤其是子查询是小表，外表是大表的情况下，效率变慢许多）。　

　相关子查询：子查询依赖外层连接的返回值；

　　非相关子查询：子查询不依赖外层连接的返回值；

　　子查询分两种，from语句（派生表）和where语句（子查询），派生表的效率要高一些，5.6的优化就是把where语句变成from语句。

　　本来是内表小，用的in，但是据说5.6之前的版本会把非相关子查询改为相关子查询，就是把in的语句改成了exists的，结果效率超低。

　　实验说明：派生表join比派生表的速度还要快。而使用in查询需要很多分钟还没有查出来。　

>\#使用派生表 4.68秒
SELECT id FROM la WHERE cardid IN (
SELECT cardid FROM (
select cardid from la group by cardid having count(1)>50) a) ;
\#使用派生表的内连接 1.26秒
SELECT id FROM la JOIN (
select cardid from la group by cardid having count(1)>50) a ON la.cardid=a.cardid;
