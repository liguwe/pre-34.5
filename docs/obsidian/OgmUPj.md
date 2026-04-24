# 最小公共区域

>  [1257. 最小公共区域](https://leetcode.cn/problems/smallest-common-region/)

## 1. 代码

- 同 [1650. 二叉树的最近公共祖先 III：包含 parent 指针](/A2JDq8),
- 但不一样的点是，需要使用 map 构造`子节点指向父节点`

```javascript
var findSmallestRegion = function (regions, region1, region2) {
    let mapping = new Map();
    for (let item of regions) {
        let first = item[0];
        for (let it of item.slice(1)) {
            mapping.set(it, first);
        }
    }
    return LCA(region1, region2);
    function LCA(p, q) {
        let p1 = p;
        let p2 = q;
        while (p1 !== p2) {
            if (mapping.has(p1)) {
                p1 = mapping.get(p1);
            } else {
                p1 = q; // 注意不是 p1 = p2
            }
            if (mapping.has(p2)) {
                // 向前走一步
                p2 = mapping.get(p2);
            } else {
                p2 = p; // 注意不是 p2 = p1
            }
        }
        return p1;
    }
};
```

## 2. 题意

### 2.1. 输入格式

- `regions`：二维数组
	- 每个子数组的`第一个元素`是父区域
	- 后面的元素都是这个`父区域的直接子区域`
- `region1`：第一个查询区域
- `region2`：第二个查询区域

### 2.2. 示例 1

```
输入：
regions = [["Earth","North America","South America"],
          ["North America","United States","Canada"],
          ["United States","New York","Boston"],
          ["Canada","Ontario","Quebec"],
          ["South America","Brazil"]],
region1 = "Quebec",
region2 = "New York"

输出："North America"
```

让我用树形结构来可视化这个例子：

```
                    Earth
                   /     \
        North America    South America
         /          \          \
United States      Canada      Brazil
    /     \        /    \
New York  Boston  Ontario Quebec
```

解释：
1. "Quebec" 的父区域链：Quebec -> Canada -> North America -> Earth
2. "New York" 的父区域链：New York -> United States -> North America -> Earth
3. 从下往上查找，"`North America`" 是包含这两个区域的最小公共区域

### 2.3. 示例 2

```
输入：
regions = [["Earth", "North America", "South America"],
          ["North America", "United States", "Canada"],
          ["United States", "New York", "Boston"],
          ["Canada", "Ontario", "Quebec"],
          ["South America", "Brazil"]],
region1 = "Canada",
region2 = "South America"

输出："Earth"
```

使用同样的树形结构：

```
                    Earth
                   /     \
        North America    South America
         /          \          \
United States      Canada      Brazil
    /     \        /    \
New York  Boston  Ontario Quebec
```

解释：
1. "Canada" 的父区域链：Canada -> North America -> Earth
2. "South America" 的父区域链：South America -> Earth
3. 从下往上查找，"Earth" 是包含这两个区域的最小公共区域

### 2.4. 解题关键点

1. 这实际上是一个寻找`最近公共祖先(LCA, Lowest Common Ancestor)`的问题
2. 需要先构建出父子关系（可以使用哈希表存储子节点到父节点的映射）
3. 然后从两个给定节点往上查找，直到找到公共祖先
4. 类似于在树结构中查找最近公共祖先的操作
