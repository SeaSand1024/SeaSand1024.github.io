title: java的3种代理模式
author: Gin
date: 2021-06-17 21:49:09
tags: [java]
categories: 后端
---
#### 1.静态代理

    静态代理是由代理类使用目标接口的实现类的引用实现的一种代理模式，比如新建目标接口IUserDao，实现类UserDao和，静态代理类StaticUserDaoProxy（静态代理类也要实现相同的接口）。

IUserDao接口：

package com.cyy.i.dao;

/**

* @Author: Cyy

* @Description:接口

* @Date:Created in 17:00 2018/7/19

*/

public interface IUserDao {

void save();

}
UserDao实现类：

package com.cyy.i.dao.impl;

import com.cyy.i.dao.IUserDao;

/**

* @Author: Cyy

* @Description:实现类

* @Date:Created in 17:01 2018/7/19

*/

public class UserDaoimplements IUserDao {

@Override

    public void save() {

System.out.println("------已经保存数据！------");

    }

}
静态代理类StaticUserDaoProxy：

package com.cyy.i.proxy;

import com.cyy.i.dao.IUserDao;

/**

* @Author: Cyy

* @Description: 代理对象，静态代理

* @Date:Created in 17:05 2018/7/19

*/

public class StaticUserDaoProxyimplements IUserDao{

private IUserDaotarget;

    public StaticUserDaoProxy(IUserDao target) {

this.target = target;

    }

@Override

    public void save() {

System.out.println("执行目标事务前的操作。。。");

        target.save();

        System.out.println("执行目标事务后的操作。。。");

    }

}
编写一个静态测试办法去主函数调用：

public static void staticProxy(){

System.out.println("----静态代理----");

    IUserDao dao=new UserDao();

    //静态代理的实质是用代理类引用目标类的实例执行，将原来的办法做二层封装，实现原有事务执行前后的一些操作，即办法的重写，是事先编译好的，生成字节码的代理类。

    StaticUserDaoProxy daoProxy=new StaticUserDaoProxy(dao);

    //执行调用

    daoProxy.save();

}

public static void main(String[] args) {

    staticProxy();

}
测试结果：




静态代理
#### 2.jdk动态代理模式

    jdk动态代理模式是通过java的反射机制实现的，避免静态代理下多个接口多种事务需求而需要多写冗余的代码，而且不需要实现目标接口，同上使用相同的目标接口和实现类，只是代理类变成了DynamicUserDaoProxy。

动态代理类DynamicUserDaoProxy：

package com.cyy.i.proxy;

import java.lang.reflect.InvocationHandler;

import java.lang.reflect.Method;

import java.lang.reflect.Proxy;

/**

* @Author: Cyy

* @Description:jdk动态代理类

* @Date:Created in 17:15 2018/7/19

*/

public class DynamicUserDaoProxy {

private Objecttarget;

    public DynamicUserDaoProxy(Object target) {

this.target = target;

    }

public ObjectgetProxyInstance(){

return Proxy.newProxyInstance(

target.getClass().getClassLoader(),

                target.getClass().getInterfaces(),

                new InvocationHandler(){

@Override

                    public Objectinvoke(Object proxy, Method method, Object[] args)throws Throwable {

System.out.println("执行目标事务前的操作。。。");

                        Object returnValue=method.invoke(target,args);

                        System.out.println("执行目标事务后的操作。。。");

                        return returnValue;

                    }

});

    }

}
同样在主函数添加测试静态方法dynamicProxy():

public static void dynamicProxy(){

System.out.println("----jdk动态代理----");

    IUserDao dao=new UserDao();

    System.out.println(dao.getClass());

    IUserDao daoProxy = (IUserDao)new DynamicUserDaoProxy(dao).getProxyInstance();

    System.out.println(daoProxy.getClass());

    //执行调用

    daoProxy.save();

}

public static void main(String[] args) {

    staticProxy();

    dynamicProxy();

}
测试结果:




jdk动态代理
#### 3.基于cglib的动态代理

    基于jdk的动态代理是需要一个实现接口的目标对象，实现单独对象的话要使用cglib的代理。新建一个CUserDao目标类，以及一个代理工厂类ProxyFactory，spring的核心包已经包括cglib的包，这里导入spring-core-4.0.0.RELEASE.jar的版本。

CUserDao目标类：

package com.cyy.ni.dao;

/**

* @Author: Cyy

* @Description: CUserDao目标类

* @Date:Created in 18:01 2018/7/19

*/

public class CUserDao {

public void save() {

System.out.println("----已经保存数据!----");

    }

}
代理工厂类ProxyFactory：

package com.cyy.ni.proxy;

import org.springframework.cglib.proxy.Enhancer;

import org.springframework.cglib.proxy.MethodInterceptor;

import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**

* @Author: Cyy

* @Description: 代理工厂类ProxyFactory

* @Date:Created in 18:01 2018/7/19

*/

public class ProxyFactoryimplements MethodInterceptor {

private Objecttarget;

    public ProxyFactory(Object target) {

this.target = target;

    }

public ObjectgetProxyInstance() {

Enhancer en=new Enhancer();

        en.setSuperclass(target.getClass());

        en.setCallback(this);

        return en.create();

    }

@Override

    public Objectintercept(Object o, Method method, Object[] objects, MethodProxy proxy)throws Throwable {

System.out.println("执行目标事务前的操作。。。");

        Object reuturnValue = method.invoke(target, objects);

        System.out.println("执行目标事务后的操作。。。");

        return reuturnValue;

    }

}
主函数中的的静态方法：

public static void CGlibDynamicProxy(){

    System.out.println("----CGlib动态代理----");

    CUserDao target =new CUserDao();

    CUserDao proxy = (CUserDao)new ProxyFactory(target).getProxyInstance();

    System.out.println(proxy.getClass());

    proxy.save();

}

public static void main(String[] args) {

        CGlibDynamicProxy();

    }
测试结果：




cglib代理
#### 4.spring中的代理

    Spring中代理对象可通过xml配置方式获得，也可通过ProxyFactory手动编程方式创建对象。先讲手动编程的方式。Spring中的代理对象其实是JDK Proxy和CGLIB Proxy 的结合。 下面我们新建spring包，新建目标类MyTarget，目标接口PeopleService，它的实现类EnglishService，织入类AroundInteceptor实现aop包下MethodInterceptor的接口，测试类ProxyFactoryTest，这里要导入的几个jar包有spring-aop-4.0.0.RELEASE.jar，aopalliance-1.0.jar，aspectjweaver-1.8.1.jar，commons-logging-1.0.4.jar。

目标类MyTarget：

package com.cyy.spring;

/**

* @Author: Cyy

* @Description: 目标类MyTarget

* @Date:Created in 19:29 2018/7/19

*/

public class MyTarget {

public void printName(){

System.out.println("name:Target-");

    }

}
目标接口PeopleService：

package com.cyy.spring;

/**

* @Author: Cyy

* @Description: 目标接口PeopleService

* @Date:Created in 19:30 2018/7/19

*/

public interface PeopleService {

public void sayHello();

    public void printName(String name);

}
实现类EnglishService：

package com.cyy.spring;

/**

* @Author: Cyy

* @Description: 实现类EnglishService

* @Date:Created in 19:34 2018/7/19

*/

public class EnglishServiceimplements PeopleService {

@Override

    public void sayHello() {

System.out.println("Hi");

    }

@Override

    public void printName(String name) {

System.out.println("Your name:"+name);

    }

}
织入类AroundInteceptor：

package com.cyy.spring;

import org.aopalliance.intercept.MethodInterceptor;

import org.aopalliance.intercept.MethodInvocation;

/**

* @Author: Cyy

* @Description: 织入类AroundInteceptor

* @Date:Created in 19:40 2018/7/19

*/

public class AroundInteceptorimplements MethodInterceptor {

@Override

    public Objectinvoke(MethodInvocation methodInvocation)throws Throwable {

System.out.println(methodInvocation.getMethod().getName()+"调用之前");

        Object res=methodInvocation.proceed();

        System.out.println(methodInvocation.getMethod().getName()+"调用之后");

        return res;

    }

}
测试类ProxyFactoryTest：

package com.cyy.spring;

import org.junit.Test;

import org.springframework.aop.framework.ProxyFactory;

/**

* @Author: Cyy

* @Description: 测试类ProxyFactoryTest

* @Date:Created in 19:42 2018/7/19

*/

public class ProxyFactoryTest {

//没有指定代理类的使用cglib代理

@Test

    public void classProxy(){

        ProxyFactory factory=new ProxyFactory();

        factory.setTarget(new MyTarget());

        factory.addAdvice(new AroundInteceptor());

        MyTarget myTarget = (MyTarget) factory.getProxy();

        myTarget.printName();

        System.out.println(myTarget.getClass().getName());

    }

//指定代理类的使用jdk代理

@Test

    public void interfaceProxy(){

ProxyFactory factory=new ProxyFactory();

        factory.setInterfaces(new Class[]{PeopleService.class});

        factory.addAdvice(new AroundInteceptor());

        factory.setTarget(new EnglishService());

        PeopleService peopleProxy = (PeopleService) factory.getProxy();

        peopleProxy.sayHello();

        peopleProxy.printName("cyy");

        System.out.println(peopleProxy.getClass().getName());

    }

}
测试结果：







        从运行结果的代理类的class name ,以及前两节中讲的，很清晰的看到Spring中对于指定接口的代理类，Spring中使用的是JDK的Proxy，对于不指定接口的使用CGLIB的方式。对于上面的测试方法interfaceProxy，我们只注释掉 

//factory.setInterfaces(new Class[] { PeopleService.class }) 这行代码，在次运行，结果为：


使用的是CGLIB处理，从而验证我们的猜想。 

