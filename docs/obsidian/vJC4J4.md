# 嵌套列表加权和 II

> [364. 嵌套列表加权和 II](https://leetcode.cn/problems/nested-list-weight-sum-ii/)



> [!danger]
> - **339题**：深度越深，权重越大
> - **364题**：深度越深，权重越小



```javascript
示例：[1,[4,[6]]]

最大深度 = 3
权重计算：
- 1 在深度1：1 × 3 = 3    (权重 = 3)
- 4 在深度2：4 × 2 = 8    (权重 = 2)
- 6 在深度3：6 × 1 = 6    (权重 = 1)

结果：3 + 8 + 6 = 17
```


和 [339. 嵌套列表加权和](/vw4vYN) 基本一样，但是需要先计算一遍最大深度


```javascript hl:2,14,19
var depthSumInverse = function (nestedList) {
    // 1. 先获取最大深度
    let maxDepth = 1;
    function getDepth(root, depth) {
        maxDepth = Math.max(maxDepth, depth);
        for (let item of root) {
            if (!item.isInteger()) {
                getDepth(item.getList(), depth + 1);
            }
        }
    }
    getDepth(nestedList, 1);

    // 2. 计算加权和
    let res = 0;
    function traverse(root, depth) {
        for (let item of root) {
            if (item.isInteger()) {
                // 关键区别：权重 = maxDepth - depth + 1
                res += item.getInteger() * (maxDepth - depth + 1);
            } else {
                traverse(item.getList(), depth + 1);
            }
        }
    }
    traverse(nestedList, 1);
    return res;
};

```
