title: spring之aop配置与springboot aop配置
author: Gin
date: 2021-06-17 21:51:03
tags: [java,spring]
categories: 后端
---
spring的面向切面编程，即aop编程是有3种作用的：

- 日志记录

- 安全验证

- 数据库事务管理

这里简单的先讲述下日志的记录体现。

1.spring的aop配置有基于注解和xml2种，为了方便演示，这里用上次ssm搭建代码来演示，代码地址https://gitee.com/cyy2csy/ssm。

（1）基于xml的spring aop配置

    新建包Aspect，在下面新建织入类LoggingAspect：

package com.cyy.maven.core.Aspect;

import org.aspectj.lang.JoinPoint;

import org.aspectj.lang.ProceedingJoinPoint;

import org.aspectj.lang.annotation.*;

/**

* @Author: Cyy

* @Description: 织入类

* @Date:Created in 16:00 2018/7/22

*/

@Slf4j

public class LoggingAspect {

    public void beforeMethod(JoinPoint joinPoint){

    String methodName = joinPoint.getSignature().getName();

        Object [] args = joinPoint.getArgs();

       log.info("The method={} begins with={}",methodName,Arrays.asList(args));

    }

public void afterMethod(JoinPoint joinPoint){

    String methodName = joinPoint.getSignature().getName();

    log.info("The method={} ends",methodName);

    }

  public void afterReturning(JoinPoint joinPoint, Object result){

    String methodName = joinPoint.getSignature().getName();

       log.info("The method={},ends with={}",methodName,result);

    }

public void afterThrowing(JoinPoint joinPoint, Exception e){

    String methodName = joinPoint.getSignature().getName();

      log.error("The method={},occurs excetion:={}",methodName,e);

    }

  public Object aroundMethod(ProceedingJoinPoint pjd){

    Object result =null;

        String methodName = pjd.getSignature().getName();

        try {

            //前置通知

          log.info("The method={},begins with={}", methodName, Arrays.asList(pjd.getArgs()));

            //执行目标方法

            result = pjd.proceed();

            //返回通知

          log.info("The method={},ends with={}",methodName ,result);

        }catch (Throwable e) {

            //异常通知

           log.error("The method={}，occurs exception:={}",methodName,e);

            throw new RuntimeException(e);

        }

//后置通知

       log.info("The method={},ends",methodName);

        return result;

    }

}
在spring的配置文件spring-context.xml中配置基于aop的事务增强。

<bean id="loggingAspect" class="com.cyy.maven.core.Aspect.LoggingAspect"/>

<aop:config>

<aop:pointcut id="serviceOpearation" expression="execution(* com.cyy.maven.core.service.impl.*.*(..))"/>

<aop:aspect ref="loggingAspect">

    <aop:before method="beforeMethod" pointcut-ref="serviceOpearation"/>

    <aop:after method="afterMethod" pointcut-ref="serviceOpearation"/>

    <aop:after-returning method="afterReturning" pointcut-ref="serviceOpearation" returning="result"/>

    <aop:after-throwing method="afterThrowing" pointcut-ref="serviceOpearation" throwing="e"/>

</aop:aspect>

<!--<aop:advisor advice-ref=""/>-->

</aop:config>
测试结果：


beforeMethod



afterMethod&afterReturning
在spring-context.xml中其实可以直接配置<aop:around method="aroundMethod" pointcut-ref="serviceOpearation"/>环绕通知，等价于前面3个办法的功能。

（2）基于注解的spring aop配置

LoggingAspect的配置改为如下：

package com.cyy.maven.core.Aspect;

import org.aspectj.lang.JoinPoint;

import org.aspectj.lang.ProceedingJoinPoint;

import org.aspectj.lang.annotation.*;

import org.springframework.stereotype.Component;

import java.util.Arrays;

/**

* @Author: Cyy

* @Description:

* @Date:Created in 16:00 2018/7/22

*/

@Slf4j

@Aspect

@Component

public class LoggingAspect {

@Pointcut("execution(* com.cyy.maven.core.service.impl.*.*(..))")

private void log(){}

@Before("log()")

public void beforeMethod(JoinPoint joinPoint){

String methodName = joinPoint.getSignature().getName();

        Object [] args = joinPoint.getArgs();

         log.info("The method={},begins with={}",methodName,Arrays.asList(args));

    }

@After("log()")

public void afterMethod(JoinPoint joinPoint){

String methodName = joinPoint.getSignature().getName();

        log.info("The method={},ends",methodName);

    }

@AfterReturning(pointcut ="log()",returning ="result")

public void afterReturning(JoinPoint joinPoint, Object result){

String methodName = joinPoint.getSignature().getName();

      log.info("The method={},ends with={}",methodName,result);

    }

@AfterThrowing(pointcut ="log()",throwing ="e")

public void afterThrowing(JoinPoint joinPoint, Exception e){

String methodName = joinPoint.getSignature().getName();

       log.error("The method={},occurs excetion:={}",methodName,e);

    }

//    @Around("log()")

    public ObjectaroundMethod(ProceedingJoinPoint pjd){

Object result =null;

        String methodName = pjd.getSignature().getName();

        try {

//前置通知

           log.info("The method={},begins with={}", methodName, Arrays.asList(pjd.getArgs()));

            //执行目标方法

            result = pjd.proceed();

            //返回通知

           log.info("The method={},ends with={}",methodName ,result);

        }catch (Throwable e) {

//异常通知

            log.error("The method={}，occurs exception:={}",methodName,e);

            throw new RuntimeException(e);

        }

//后置通知

      log.info("The method={},ends",methodName);

        return result;

    }

}


spring配置文件spring-context.xml的配置如下：

<!-- 配置自动扫描-->

<context:component-scan base-package="com.cyy.maven.core.Aspect"/>

<!--告诉JVM 我们用了aspectj的 annotation -->

<aop:aspectj-autoproxy/>
测试结果如图：




beforeMethod



afterMethod&afterReturning
在aroundMethod加上@Around("log()")，注释掉其他的注解，可以实现相同的功能。

2.springboot的aop配置不用基于xml，是完全基于注解的配置，和spring的注解配置很相似。

这里也直接用以前搭建的springboot框架来测试，码云地址为https://gitee.com/cyy2csy/girl.git。

新建Aspect包，下面新建HttpAspect织入类：

package com.cyy.Aspect;

import lombok.extern.slf4j.Slf4j;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;

import org.aspectj.lang.ProceedingJoinPoint;

import org.aspectj.lang.annotation.*;

import org.springframework.stereotype.Component;

import org.springframework.web.context.request.RequestContextHolder;

import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j

@Aspect

@Component

public class HttpAspect {

@Pointcut("execution(public * com.cyy.controller.GirlController.*(..))")

public void log(){}

@Before("log()")

public void doBefore(JoinPoint joinPoint){

ServletRequestAttributes attributes= (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        HttpServletRequest request= (HttpServletRequest) attributes.getRequest();

        log.info("执行事务之前。。。");

        log.info("url={}",request.getRequestURI());

        log.info("method={}",request.getMethod());

        log.info("ip={}",request.getRemoteAddr());

        log.info("class-method={}",joinPoint.getSignature().getDeclaringTypeName()+"."+joinPoint.getSignature().getName());

        log.info("args={}",joinPoint.getArgs());

    }

@After("log()")

public void doAfter(){

log.info("执行事务之后。。。");

    }

@AfterReturning(returning ="object", pointcut ="log()")

public void doAfterReturning(Object object) {

log.info("response={}", object.toString());

    }

@AfterThrowing(pointcut ="log()",throwing ="e")

public void afterThrowing(JoinPoint joinPoint, Exception e){

String methodName = joinPoint.getSignature().getName();

      log.info("The method={}" + methodName +" occurs excetion:={}" + e);

    }

//    @Around("log()")

    public ObjectaroundMethod(ProceedingJoinPoint pjd){

Object object =null;

        String methodName = pjd.getSignature().getName();

        try {

//前置通知

            ServletRequestAttributes attributes= (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            HttpServletRequest request= (HttpServletRequest) attributes.getRequest();

            log.info("执行事务之前。。。");

            log.info("url={}",request.getRequestURI());

            log.info("method={}",request.getMethod());

            log.info("ip={}",request.getRemoteAddr());

            log.info("class-method={}",pjd.getSignature().getDeclaringTypeName()+"."+pjd.getSignature().getName());

            log.info("args={}",pjd.getArgs());

            //执行目标方法

            object = pjd.proceed();

            //返回通知

            log.info("response={}", object.toString());

        }catch (Throwable e) {

//异常通知

          log.info("The method={},occurs exception:={}",methodName,e);

            throw new RuntimeException(e);

        }

//后置通知

        log.info("执行事务之后。。。");

        return object;

    }

}
测试结果：


同样的， 将@Around("log()")加上，将其他注解注释掉，运行也是同样的结果。


