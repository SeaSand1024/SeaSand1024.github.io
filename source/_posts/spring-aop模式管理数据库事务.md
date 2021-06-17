title: spring aop模式管理数据库事务
author: Gin
date: 2021-06-17 21:52:12
tags: [java,spring]
categories: 后端
---
####1.搭建项目环境，基于idea下maven环境的搭建，此处贴出pom文件的jar包依赖：

    <?xml version="1.0" encoding="UTF-8"?>
    
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
    
      <groupId>com.cyy</groupId>
      <artifactId>spring_aop</artifactId>
      <version>1.0-SNAPSHOT</version>
    
      <name>spring_aop</name>
      <!-- FIXME change it to the project's website -->
      <url>http://www.example.com</url>
    
      <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <spring.version>4.3.12.RELEASE</spring.version>
      </properties>
    
      <dependencies>
        <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>4.11</version>
          <scope>test</scope>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-aop</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>aopalliance</groupId>
          <artifactId>aopalliance</artifactId>
          <version>1.0</version>
        </dependency>
    
        <dependency>
          <groupId>org.aspectj</groupId>
          <artifactId>aspectjrt</artifactId>
          <version>1.8.11</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-aspects</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-tx</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-jdbc</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>mysql</groupId>
          <artifactId>mysql-connector-java</artifactId>
          <version>5.1.42</version>
        </dependency>
    
        <dependency>
          <groupId>c3p0</groupId>
          <artifactId>c3p0</artifactId>
          <version>0.9.1.2</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-beans</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-core</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-context</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
        <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-expression</artifactId>
          <version>${spring.version}</version>
        </dependency>
    
    
      </dependencies>
    
      <build>
        <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
          <plugins>
            <plugin>
              <artifactId>maven-clean-plugin</artifactId>
              <version>3.0.0</version>
            </plugin>
            <!-- see http://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
            <plugin>
              <artifactId>maven-resources-plugin</artifactId>
              <version>3.0.2</version>
            </plugin>
            <plugin>
              <artifactId>maven-compiler-plugin</artifactId>
              <version>3.7.0</version>
            </plugin>
            <plugin>
              <artifactId>maven-surefire-plugin</artifactId>
              <version>2.20.1</version>
            </plugin>
            <plugin>
              <artifactId>maven-jar-plugin</artifactId>
              <version>3.0.2</version>
            </plugin>
            <plugin>
              <artifactId>maven-install-plugin</artifactId>
              <version>2.5.2</version>
            </plugin>
            <plugin>
              <artifactId>maven-deploy-plugin</artifactId>
              <version>2.8.2</version>
            </plugin>
          </plugins>
        </pluginManagement>
      </build>
    </project>

具体的搭建项目步骤，自行百度解决。

####2.转账事务环境搭建：
1）创建表和各个类与接口：

        create database ee19_spring_day03;
        use ee19_spring_day03;
        create table account(
          id int primary key auto_increment,
          username varchar(50),
          money int
        );
        insert into account(username,money) values('jack','10000');
        insert into account(username,money) values('rose','10000');

- 新建service层和dao层以及各自下面的impl层
- 在dao下面新建AccountDao接口，代码如下：

        package com.cyy.dao;

        /**
         * @Author: Cyy
         * @Description:
         * @Date:Created in 22:37 2018/8/1
         */
        public interface AccountDao {
        
            public void out(String outer, Integer money) ;
            public void in(String inner, Integer money) ;
        
        }
- 在dao下的impl下新建实现类AccountDaoImpl，继承自JdbcDaoSupport，实现其中的方法：

        package com.cyy.dao.impl;
        
        import com.cyy.dao.AccountDao;
        import org.springframework.jdbc.core.support.JdbcDaoSupport;
        
        /**
         * @Author: Cyy
         * @Description:
         * @Date:Created in 22:37 2018/8/1
         */
        public class AccountDaoImpl extends JdbcDaoSupport implements AccountDao {
            @Override
            public void out(String outer, Integer money) {
        
                this.getJdbcTemplate().update("update account set money = money - ? where username = ?", money,outer);
            }
        
            @Override
            public void in(String inner, Integer money) {
                this.getJdbcTemplate().update("update account set money = money + ? where username = ?", money,inner);
            }
        }

- 新建service下AccountService接口：

        package com.cyy.service;
        
        /**
         * @Author: Cyy
         * @Description:
         * @Date:Created in 22:40 2018/8/1
         */
        public interface AccountService {
        
            public void transfer(String outer, String inner, Integer money);
        }

- 新建service.impl下AccountServiceImpl实现类：

        package com.cyy.service.impl;
        
        import com.cyy.dao.AccountDao;
        import com.cyy.service.AccountService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.beans.factory.annotation.Qualifier;
        
        /**
         * @Author: Cyy
         * @Description:
         * @Date:Created in 22:40 2018/8/1
         */
        public class AccountServiceImpl  implements AccountService{
        
        
            public void setAccountDao(AccountDao accountDao) {
                this.accountDao = accountDao;
            }
        
            private AccountDao accountDao;
        
        
            @Override
            public void transfer(String outer, String inner, Integer money) {
                // TODO Auto-generated method stub
                accountDao.out(outer, money);
                //断电
        //        int i = 1 / 0;
                accountDao.in(inner, money);
            }
        }

2）完善配置文件
- 在main下新建与java的同级目录resources，并且标记为Resources Root;
- 在resources下新建spring上下文文件applicationContext.xml，配置初始配置内容如下：


    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:aop="http://www.springframework.org/schema/aop"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:tx="http://www.springframework.org/schema/tx"
           xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
            http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.1.xsd
           http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.1.xsd">
    	<context:property-placeholder location="classpath:jdbc.properties"/>
    
    	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    		<property name="driverClass" value="${jdbc.driver}"/>
    		<property name="jdbcUrl" value="${jdbc.url}"/>
    		<property name="user" value="${jdbc.username}"/>
    		<property name="password" value="${jdbc.password}"/>
    	</bean>
    	
    	<bean id="accountDao" class="com.cyy.dao.impl.AccountDaoImpl">
    		<property name="dataSource" ref="dataSource"/>
    	</bean>
    	
    	<bean id="accountService" class="com.cyy.service.impl.AccountServiceImpl">
    		<property name="accountDao" ref="accountDao"/>
    	</bean>
    	
    </beans>

- 在resources下新建jdbc.properties配置文件：


    jdbc.driver=com.mysql.jdbc.Driver
    jdbc.url=jdbc:mysql://localhost:3306/ee19_spring_day03
    jdbc.username=root
    jdbc.password=

3）测试文件的配置
- 在main同级的test文件下的java下新建test文件（其实已经maven自动生成了），如图：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-f0a8e95d111c2c32.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

配置代码：

    package com.cyy;
    
    
    import com.cyy.service.AccountService;
    import org.junit.Test;
    import org.springframework.context.ApplicationContext;
    import org.springframework.context.support.ClassPathXmlApplicationContext;
    
    /**
     * Unit test for simple App.
     */
    public class AppTest 
    {
        /**
         * Rigorous Test :-)
         */
        @Test
        public void demo01(){
            String xmlPath = "applicationContext.xml";
            ApplicationContext applicationContext = new ClassPathXmlApplicationContext(xmlPath);
            AccountService accountService =  (AccountService) applicationContext.getBean("accountService");
            accountService.transfer("rose", "jack", 1000);
        }
    
    }
####3.测试运行 
原本数据库jack和rose的money都是10000的：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-ac72d8c125bc3062.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

此处在AccountServiceImpl暂时注销掉了
  //        int i = 1 / 0;
先保证事务的正确运行查看效果，点击运行AppTest类：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-ab28af911bfe3aac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

测试通过，再来查看数据库：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-749472f82639c604.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

已经成功实现了转账1000块的功能，这次把  //        int i = 1 / 0;注释去掉，
并且恢复数据库原本数值，再次点击AppTest类运行：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-9fe139292e669e3f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

异常报错，再去查看数据库：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-5a2104cf2c23e421.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

事务没有正确回滚，导致事务的ACID特性被破坏，所以接下来，我们将通过几种方式实现事务的管理。

####4.手动事务管理

- 修改AccountService接口：


    package com.cyy.service;
    
    /**
     * @Author: Cyy
     * @Description:
     * @Date:Created in 22:40 2018/8/1
     */
    public interface AccountService {
    
    //    public void transfer(String outer, String inner, Integer money);
        public void transfer(final String outer,final String inner,final Integer money);
    }

- 将AccountServiceImpl中原来的transfer注释掉，添加以下代码：


        private TransactionTemplate transactionTemplate;
        public void setTransactionTemplate(TransactionTemplate transactionTemplate) {
            this.transactionTemplate = transactionTemplate;
        }
        @Override
        public void transfer(final String outer,final String inner,final Integer money) {
            transactionTemplate.execute(new TransactionCallbackWithoutResult() {
    
                @Override
                protected void doInTransactionWithoutResult(TransactionStatus arg0) {
                    accountDao.out(outer, money);
                    //断电
  				    int i = 1/0;
                    accountDao.in(inner, money);
                }
            });
    
        }

- 修改applicationContext.xml配置文件：


	<bean id="accountService" class="com.cyy.service.impl.AccountServiceImpl">
		<property name="accountDao" ref="accountDao"/>
		<property name="transactionTemplate" ref="transactionTemplate"/>
	</bean>
	<!-- 手动模式，使用TransactionTemplate -->
	 <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource"/>
	</bean>
	
	<bean id="transactionTemplate" class="org.springframework.transaction.support.TransactionTemplate">
		<property name="transactionManager" ref="txManager"/>
	</bean>
- 再次点击AppTest类运行测试，运行结果：

![image.png](https://upload-images.jianshu.io/upload_images/10224563-48ab6b16ab8d2df0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如期报错,再去查看数据库：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-dcdf6ad87573eace.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如期实现了手动的事务管理，通过spring底层使用 TransactionTemplate 事务模板进行操作。

####5.代理工厂实现的事务管理

- 修改AccountService接口和AccountServiceImpl类以及applicationContext.xml为原本的配置；

然后新增如下配置：

     <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
       <property name="dataSource" ref="dataSource"/>
     </bean>
        <bean id="proxyAccountService" class="org.springframework.transaction.interceptor.TransactionProxyFactoryBean">
    	<property name="proxyInterfaces" value="com.cyy.service.AccountService"/>
    	<property name="target" ref="accountService"/>
    	<property name="transactionManager" ref="txManager"/>
    	<property name="transactionAttributes">
    		<props>
    			<prop key="transfer">PROPAGATION_REQUIRED,ISOLATION_DEFAULT</prop>
    		</props>
    	</property>
    </bean>	

- 在AppTest中新建demo2方法：

        @Test
        public void demo02(){
            String xmlPath = "applicationContext.xml";
            ApplicationContext applicationContext = new ClassPathXmlApplicationContext(xmlPath);
            AccountService accountService =  (AccountService) applicationContext.getBean("proxyAccountService");
            accountService.transfer("jack", "rose", 1000);
        }

- 测试结果：

![image.png](https://upload-images.jianshu.io/upload_images/10224563-6f94344b6dcf4d61.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一样报错，但是数据库没有实现错误转账，如图：

![image.png](https://upload-images.jianshu.io/upload_images/10224563-ba3ab6d571d669c7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####6.基于xml的aop事务配置

- 修改applicationContext.xml配置文件：

    	<!--事务管理器的配置-->
    	 <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
           <property name="dataSource" ref="dataSource"/>
       </bean>
    	<!-- 基于xml的aop事务配置 -->
    	<tx:advice id="txAdvice" transaction-manager="txManager">
    		<tx:attributes>
    			<tx:method name="transfer" propagation="REQUIRED" isolation="DEFAULT"/>
    		</tx:attributes>
    	</tx:advice>

    	<aop:config>
    		<aop:advisor advice-ref="txAdvice" pointcut="execution(* com.cyy.service.impl.*.*(..))"/>
    	</aop:config>

- 运行测试AppTest类的demo1()方法：

![image.png](https://upload-images.jianshu.io/upload_images/10224563-218e84e6ecb0e0a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

数据库：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-9640bee658b2336a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####7.基于注解的aop事务配置

- 在applicationContext.xml中将以上代理类的配置替换成

         <tx:annotation-driven transaction-manager="txManager"/>
- 在需要进行事务操作的类或者方法上进行加上注解 @Transactional，同时可以配置事务传播级别和事务隔离级别，例如：

      @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.DEFAULT)

简单解释一下，这里的传播级别设置的是REQUIRED,即支持当前事务，如果当前没有事务，就新建一个事务，一般默认采用此配置;隔离级别DEFAULT，使用数据库默认的事务隔离级别（MySQL 事务默认隔离级别是可重复读）。
- 再次查看测试结果：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-fea1db5aaed45a0d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

报错，数据库：
![image.png](https://upload-images.jianshu.io/upload_images/10224563-c891d9eec4750387.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)














            





















