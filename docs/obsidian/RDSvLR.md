# 贪心算法：区间调度问题

`#算法`  `#算法/动态规划` 
 


## 第 1 题：无重叠区间问题 

https://leetcode.cn/problems/non-overlapping-intervals/

![image.png|533](https://832-1310531898.cos.ap-beijing.myqcloud.com/11acaca424e010615da55841318f8763.png)

**需要移除区间的 `最小数量`，使剩余区间互不重叠** ，所以我们先找究竟 `有多少区间不重叠?` 

### 第一步：有多少个区间互不重叠呢？

1. 先按照 `end` 排序，选出区间 `x` 
		a. `count`  代表 `不重叠区间的个数` ，
		b.  所有**不与** `x` 相交的  ，`count + 1`
2. 重复上面的  a 、b


> [!danger]
>  注意，下面动图的`绿色的区间`个数使我们需要的，即 `count`，别管`红线区间`


如下动图：

![1 (1).gif|549](https://832-1310531898.cos.ap-beijing.myqcloud.com/40a0023c6191e2f0923c48337d98db69.gif)

下面的 `start` 代表当前遍历到`区间的左边的值` , 所以这里判断不相交的条件是是 `start >= end` ，看下图就明白了了

![image.png|547](https://832-1310531898.cos.ap-beijing.myqcloud.com/346a3fe7d81477fa75bf1a2e3a23ecb7.png)

所以得出以下代码：

```javascript
var notCrossingIntervals = function (intervals) {
    // base case
    if (intervals.length === 0) return 0;
    // ::::第一步：先按照 `end` 排序，并选出区间 `x` ，`即` 第一个区间
    // 升序排列
    intervals.sort((a, b) => a[1] - b[1]);

    //  :::: 至少有一个区间不相交
    let count = 1;
    // 排序后，第一个区间就是 x
    let x = intervals[0][1];

    // ::::第二步：所有与 `x`  相交的，`移除个数 + 1`
    for (let i = 1; i < intervals.length; i++) {
        let start = intervals[i][0];
        // 不相交，不相交，不相交，不相交
        if (start >= x) {
            console.log('不相交');
            count++;
            x = intervals[i][1];
        }
    }
    // 返回相交的个数，即为要移除的个数
    return count;
};
```


### 第二步：需要移除的个数，简单加减法即可

```javascript

/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function (intervals) {
    return intervals.length - notCrossingIntervals(intervals);
};
```

## 第 2 题：用最少数量的箭引爆气球

https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/

![image.png|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/f39e0bd05d070bc6b302ca860d32b6f6.png)

是的，这个和上题[#示例 1：无重叠区间问题](/RDSvLR#%E7%A4%BA%E4%BE%8B-1%E6%97%A0%E9%87%8D%E5%8F%A0%E5%8C%BA%E9%97%B4%E9%97%AE%E9%A2%98) 一模一样，除了`擦边`也会爆炸之外，如下图所示：

![image.png|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/3d002efc335db040d469797519f648c0.png)


![image.png|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/a7f8849be07e5398e0052c023da7bb97.png)

下面是代码：

```javascript
var findMinArrowShots = function(points) {
    if (!points.length) return 0
    points.sort((a, b) => {
        return a[1] - b[1]
    })
    let count = 1;
    let x = points[0][1];
    for (let i = 1; i < points.length; i++) {
        // :::: 不相交
        if (points[i][0] > x) {
            x = points[i][1]
            count += 1
        }
    }
    return count
};
```

或者也行：

> [!question]
> 请思考，上面的不相交判断，为什么不需要`|| x > points[i][1]` 也行？


```javascript
var findMinArrowShots = function(points) {
    if (!points.length) return 0
    points.sort((a, b) => {
        return a[1] - b[1]
    })
    let count = 1;
    let x = points[0][1];
    for (let i = 1; i < points.length; i++) {
        // :::: 不相交
        if (points[i][0] > x || x > points[i][1]) {
            x = points[i][1]
            count += 1
        }
    }
    return count
};

```

## 第 3 题：跳跃游戏 I 

https://leetcode.cn/problems/jump-game/

## 第 4 题：跳跃游戏 II

https://leetcode.cn/problems/jump-game-ii/
