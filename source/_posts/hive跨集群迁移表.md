---
title: hive跨集群迁移表
type: categories
copyright: true
date: 2021-06-17 17:29:38
tags: hive
categories: 数据开发
---

1.export table xxx to '/tmp/xxxx';

2.hadoop fs - get /tmp/xxx /tmp/xxx

3.scp文件。。。

4.zip -r /tmp/xxxx.zip /tmp/xxx

5.unzip xxx.zip /tmp/

6.hadoop fs -put /tmp/xxxx /tmp/xxxx

7.import table xxx from '/tmp/xxx'__