# 嵌套列表加权和

> [339. 嵌套列表加权和](https://leetcode.cn/problems/nested-list-weight-sum/)

## 题目

>  注意和 [364. 嵌套列表加权和 II](/vJC4J4) 的区别


```javascript
输入: [1,[4,[6]]]

分析:
- 1 在第1层，权重为1
- 4 在第2层，权重为2
- 6 在第3层，权重为3

计算:
1*1 + 4*2 + 6*3 = 1 + 8 + 18 = 27

输入: [1,[4,[6](#)]] 
输出: 44 
解释: 
- 1*1 = 1
- 4*2 = 8 
- 6*4 = 24 
总和 = 44
```

## 代码

```javascript
var depthSum = function (nestedList) {
    let res = 0;
    function traverse(root, depth) {
        for (let item of root) {
            if (item.isInteger()) {
                res += item.getInteger() * depth; // 直接用当前深度作为权重
            } else {
                traverse(item.getList(), depth + 1);
            }
        }
    }
    traverse(nestedList, 1);
    return res;
};
```
