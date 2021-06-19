title: python-时间序列处理
author: Gin
date: 2021-06-17 21:55:56
tags:
  - python
  - 时间序列处理 
categories:
  - 数据分析
---
数据说明：’./data/raw/pm25.csv’文件为某地2017年一段时间内的PM2.5的每小时监测数据，数据按时间顺序记录（从2017-01-01 00:00:00开始，中间不间断），由于各种原因造成了某些时刻的数据缺失。

要求：

1.利用已有的记录数据进行建模，将缺失值填充完整，评估指标采用RMSE、MAE和；

2.尝试多种方法进行建模，对比各种模型的性能;

3.希望你不要直接用中值、均值、前一时刻、后一时刻等常数填充法进行填充（方法对比中可用做简单对比，如表 2所示）；

4.将数据填充完整后保存至’pm25_predicted.csv’文件（只保存缺失时刻的数据，不按要求则作废），数据格式如表 3所示（列名、文件名不按要求则作废）。

题解：

（1）完成时间序列缺失数据填充，一般来说有如下几种方式：常数填充有均值填充，中位数填充，众数填充，前一时刻和后一时刻填充，传统回归模型方式有自回归模型，移动平均模型，自回归移动平均模型和差分自回归移动平均模型，一般采用插值法填充数据，插值办法一般有滑动平均插值，线性插值，拉格朗日多项式插值；

（2）每个函数对应一种办法，先将数据用pandas从csv文件中读取为df,然后进行数据插值的算法操作，最后将插值后的数据集用matplotlib呈现出来，最后将插值的数据转化为df，用pandas重新写回csv之中；

代码：

1.time_series_fill.py

>\# -*- coding:utf-8 -*-
>from pandas.compat import reduce
>__author__ = 'gin.chen'
>import pandas as pd
>import numpy as np
>import matplotlib.pyplot as plt
>from scipy.interpolate import lagrange
>\# from fbprophet import Prophet
#

# 加载数据

>def load_data():
    >df = pd.read_csv('F:/muke/super_mali/data/raw/pm25.csv')
    ># return df.head(100)
    >return df

# 画散点图

>def draw_scatte_diagram(df):
    >plt.plot(df['index'].to_list(), df['PM2.5'].to_list())
    >plt.show()

# 均值填充

>def mean_method():
    >df = load_data()
    >df.fillna(df['PM2.5'].mean(), inplace=True)
    >draw_scatte_diagram(df)

# 中位数填充

>def median_method():
    >df = load_data()
    >df.fillna(df['PM2.5'].median(), inplace=True)
    >draw_scatte_diagram(df)

# 众数填充

>def mode_method():
    >df = load_data()
    >df.fillna(df['PM2.5'].mode(), inplace=True)
    >draw_scatte_diagram(df)

# 前一时刻填充

>def ffill_method():
    >df = load_data()
    >df['PM2.5'].fillna(method='ffill', inplace=True)
    >draw_scatte_diagram(df)

# 后一时刻填充

>def bfill_method():
    >df = load_data()
    >df['PM2.5'].fillna(method='bfill', inplace=True)
    >draw_scatte_diagram(df)

# 前后时刻平均值插值

>def mean_by_before_after_method():
    >df = load_data()
    ># data_index = df['index'].to_list()
    ># data_value = df['PM2.5'].to_list()
    >fill = []
    >for i in range(len(df)):
        >if np.math.isnan(df.iloc[i - 1][1]):
            >left = df.iloc[i - 2][1]
            >for j in range(i, len(df)):
                >if np.math.isnan(df.iloc[j][1]):
                    >continue
                >else:
                    >right = df.iloc[j][1]
                    >break
            >df.iloc[i - 1, 1] = (left + right) / 2
            >fill_tuple = i, df.iloc[i - 1][1]
            >fill.append(fill_tuple)
    >draw_scatte_diagram(df)
    df = pd.DataFrame(fill, columns=['index', 'PM2.5'])
    df.to_csv('pm25_predicted_mean.csv', index=False)

# 线性插值详细

>def linear_detail(x1, y1, x2, y2):
    k = (y2 - y1) / (x2 - x1)
    b = y1 - k * x1
    return lambda x: b + k * x

# 线性插值

>def linear_method():
    # global j
    df = load_data()
    fill = []
    for i in range(len(df)):
        if np.isnan(df.iloc[i][1]):
            for j in range(i, len(df)):
                if np.isnan(df.iloc[j][1]):
                    continue
                else:
                    break
            df.iloc[i, 1] = (linear_detail(i, df.iloc[i - 1][1], j + 1, df.iloc[j][1]))(i + 1)
            fill_tuple = i + 1, df.iloc[i][1]
            fill.append(fill_tuple)
    draw_scatte_diagram(df)
    df = pd.DataFrame(fill, columns=['index', 'PM2.5'])
    df.to_csv('pm25_predicted_linear.csv', index=False)

# 平滑插值详细

>def smooth_detail(series, pos, window=5):
    """
    :param series: 列向量
    :param pos: 被插值的位置
    :param window: 为取前后的数据个数
    :return:
    """
    y = series[list(range(pos - window, pos)) + list(range(pos + 1, pos + 1 + window))]  # 取数
    y = y[y.notnull()]
    return reduce(lambda a, b: a + b, y) / len(y)

# 平滑插值

>def smooth_method(show=1):
    df_raw = load_data()
    df = df_raw['PM2.5'].copy()
    full = []
    for j in range(len(df)):
        if (df.isnull())[j]:  # 如果为空即插值。
            df[j] = smooth_detail(df, j)
            df_raw.loc[j, 'PM2.5'] = df[j]
            # print(j, df_raw.loc[j, 'index'], df_raw.loc[j, 'PM2.5'])
            full_tuple = df_raw.loc[j, 'index'], df_raw.loc[j, 'PM2.5']
            full.append(full_tuple)
    if show:
        draw_scatte_diagram(df_raw)
        df = pd.DataFrame(full, columns=['index', 'PM2.5'])
        df.to_csv('pm25_predicted_smooth.csv', index=False)
    return df_raw

# 拉格朗日插值详细

>def lagrange_detail(series, pos, window=5):
    """
    :param series: 列向量
    :param pos: 被插值的位置
    :param window: 为取前后的数据个数
    :return:
    """
    y = series[list(range(pos - window, pos)) + list(range(pos + 1, pos + 1 + window))]  # 取数
    y = y[y.notnull()]  # 剔除空值
    return lagrange(y.index, list(y))(pos)  # 插值并返回插值结果

# 拉格朗日插值

>def lagrange_method():
    df_raw = load_data()
    df = df_raw['PM2.5'].copy()
    full = []
    for j in range(len(df)):
        if (df.isnull())[j]:  # 如果为空即插值。
            df[j] = lagrange_detail(df, j)
            df_raw.loc[j, 'PM2.5'] = df[j]
            # print(j, df.loc[j, 'index'], df[j])
            full_tuple = df_raw.loc[j, 'index'], df_raw.loc[j, 'PM2.5']
            full.append(full_tuple)
    draw_scatte_diagram(df_raw)
    df = pd.DataFrame(full, columns=['index', 'PM2.5'])
    df.to_csv('pm25_predicted_lagrange.csv', index=False)

# 计算RMSE

>def calculate_RMSE(target, prediction):
    error = []
    for i in range(len(target)):
        error.append(target[i] - prediction[i])
    return (sum([n * n for n in error]) / len(error)) ** 0.5

# 计算MAE

>def calculate_MAE(target, prediction):
    error = []
    for i in range(len(target)):
        error.append(target[i] - prediction[i])
    return sum([abs(n) for n in error]) / len(error)

# 计算R-square

>def calculate_R_Square(target, prediction):
    error = []
    a = calculate_MAE(target, prediction) * len(error)
    mean = np.mean(np.array(target))
    for i in range(len(target)):
        error.append(prediction[i] - mean)
    b = sum([n * n for n in error])
    return 1 - a / b

>if __name__ == '__main__':
    # mean_method()
    # median_method()
    # mode_method()
    # ffill_method()
    # bfill_method()
    # mean_by_before_after_method()
    # linear_method()
    # lagrange_method()
    smooth_method()

2.fbprophet_fill.py

>\# -*- coding:utf-8 -*-
from pandas.io.sas.sas7bdat import _column
from time_series_fill import smooth_method
__author__ = 'gin.chen'
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
from fbprophet import Prophet
if __name__ == '__main__':
    def load_data():
        \# df = pd.read_csv('F:/muke/super_mali/data/raw/pm25.csv')
        \# return df.head(100)
        df = smooth_method(0)
        return df.head(3129)
    df = load_data()
    first_value = datetime.datetime.strptime('2017-01-01 00:00:00', '%Y-%m-%d %H:%M:%S')
    for i in range(len(df)):
        df.iloc[i, 0] = (first_value + datetime.timedelta(hours=i)).strftime("%Y-%m-%d %H:%M:%S")
    \# df = pd.DataFrame(, columns=['ds', 'y'])
    \# df.to_csv('pm25_predicted_mean.csv', index=False)
    \# print(df.iloc[1,0])
    df.rename(columns={'index': 'ds', 'PM2.5': 'y'}, inplace=True)
    m = Prophet()
    \# df['y'] = np.log(df['y'])
    df = m.fit(df)
    future = m.make_future_dataframe(freq='H', periods=5428)
    future.tail()
    forecast = m.predict(future)
    forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()
    fig1 = m.plot(forecast)
    fig2 = m.plot_components(forecast)
    plt.show()

运行结果图：
![img.png](../../../../images/post-images/10224563-269bfb4da3288c1d.png)

![img.png](../../../../images/post-images/10224563-269bfb4da3288c1d.png)

Mean



Median



Ffill_method



Bfill_method



Linear_method



lagrange_method



smooth_method



Fbprophet实现



日，周，月的趋势
未完待续。。。