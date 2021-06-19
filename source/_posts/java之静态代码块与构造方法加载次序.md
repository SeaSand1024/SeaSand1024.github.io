title: java之静态代码块与构造方法加载次序
author: Gin
date: 2021-06-17 21:54:07
tags: [java]
categories: 后端
---
- java中的静态代码块，非静态块，构造办法的加载顺序是这样的：
静态代码块 （程序加载时一次）--->非静态块（每次实例化一次）---> 构造方法（每次实例化一次），废话不多说，上代码。

#####A类：
>     public class A {
>     
>         static {
>             System.out.print("1");
>         }
>          {
>             System.out.print("#");
>         }
>     
>         public A(){
>             System.out.print("a");
>         }
>     
>     
>     }
> 
#####B类：
>     /**
>      * @Author: Cyy
>      * @Description:
>      * @Date:Created in 16:08 2018/7/28
>      */
>     public class B extends A {
>     
>         static {
>             System.out.print("2");
>         }
>          {
>             System.out.print("*");
>         }
>     
>         public B(){
>             System.out.print("b");
>         }
>         {
>             System.out.print("c");
>         }
>     
>         public static void main(String[] args) {
>     //        A a=new A();//结果12a,执行一次2个静态区代码，执行非静态代码块，再执行A的构造办法
>     //        B b=new B();//结果12ab,执行一次2个静态区代码，执行非静态代码块，再依次执行A和B的构造办法
>             A ab=new B();//同上
>     
>             ab=new B();//此时静态代码块已经加载,只加载一次，执行非静态代码块，是每次实例化都一次，跟构造方法一样，比构造办法先，输出非静态代码和构造办法的部分
>     
>         }
>     }
> 
我们尝试运行，看看结果：
![image.png](../../../../images/post-images/10224563-039c5928d44ca760.png)
结果是12\#a\*b\#a\*b,来分析下整个流程：
- 第一步按顺序加载2个类的静态代码块，程序载入时，只会执行一次，输出12；
- 第二步按顺序分别加载A类和B类的非静态代码块以及构造方法，输出#a*b;
- 第三步，再次实例化B类的时候，不在静态代码块了，只会加载非静态代码块和构造方法，再次输出结果#a*b;
