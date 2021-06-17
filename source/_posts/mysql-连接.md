title: mysql 连接
author: Gin
date: 2021-06-17 21:38:47
tags:
  - mysql
  - SQL
categories:
  - 后端
---
####1.内连接
内连接是连接的几个表之间完全匹配的记录；
基本格式为select a.\*,b.\* from a inner join b on a.id=b.id
####2.左外连接
左外连接是连接的几个表之间以左边为基准的连接，即左边的记录右边没有的会显示为空；
基本格式为select a.\*,b.\* from a left (outer) join b on a.id=b.id
####3.右外连接
右外连接是连接的几个表之间以右边为基准的连接，即左外连接的逆向，即右边的记录左边没有的会显示为空；
基本格式为select a.\*,b.\* from a right (outer) join b on a.id=b.id 
####4.全连接
全连接是几个表之间的记录是返回左表和右表中的所有行。
如果某行在另一个表中没有匹配行，则另一个表的选择列表的匹配行赋为空值，如果表之间有匹配行，则整个结果集行包含基表的数据值。
基本格式为select a.\*,b.\* from a full (outer) join b on a.id=b.id
