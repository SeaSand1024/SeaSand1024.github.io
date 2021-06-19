title: idea2017 搭建ssm框架过程
author: Gin
date: 2021-06-17 21:46:32
tags: [idea,ssm]
categories: 后端
---
环境：

    idea 2017.2.5

    jdk1.8

    maven 3.5.0



#### 1. 新建一个Maven webapp项目


配置项目groupid,artifactid,version








#### 2.搭建项目基本架构


    注意，这里自己新建的java文件夹要在设置那里标识成为Source Root,resources 设置为Resource Root。

#### 3.配置项目项目配置文件，包括mvc配置文件spring-context-mvc.xml，spring Context上下文文件spring-context.xml,mybatis-config.xml全局配置文件，数据库jdbc配置文件，使用的日志框架是logback+lombok,所以有logback配置文件。




#### 4.接下来配置mybatis动态接口代理，在dao包下新建SysUserDao,entity下新建SysUser，mapper下新建SysUserMapper.xml，在spring-context配置文件里配置如下：




#### 5.配置web.xml







#### 6.完善项目结构，方便测试，分别在controller下新建SysUserController，service下新建impl包和SysyUserService接口，impl下新建SysUserServiceImpl，utils下新建MD5Util工具类。




    测试类，测试结果：

    dao层 







service层：







service和dao层基本测试完毕，controller在这里直接启动项目测试，为了方便，直接新建一个json类统一返回；







返回值为true,并且将用户类返回，说明测试成功。

#### 7.至此，基本的搭建步骤基本完成，其中一些细节方面的，比如pom依赖的配置，各种配置文件的详细配置，可以参考我码云上的代码，只是一个基本的配置，读者可以根据自己的需求自行改变，在此贴出改项目码云地址：https://gitee.com/lonelygin/ssm。

