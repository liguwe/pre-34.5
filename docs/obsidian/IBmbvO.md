# 路径总和 IV

>  [666. 路径总和 IV](https://leetcode.cn/problems/path-sum-iv/)

## 1. 题目理解

- 第一个数字表示层级
- 第二个数字表示在该层的位置（从左到右编号）
- 第三个数字表示节点的值

### 1.1. 示例一

```javascript
     1(3)           level 1
    /    \
2(5)      2(1)      level 2
```

- `113`: 第 1 层，位置 1，值为 3
- `215`: 第 2 层，位置 1，值为 5 （左子节点）
- `221`: 第 2 层，位置 2，值为 1 （右子节点）

路径和 = (3 + 5) + (3 + 1) = 12。

### 1.2. 示例二

```javascript
     1(1)           level 1
    /    \
2(3)      2(1)      level 2
/
3(2)                level 3
```

- `111`: 第1层，位置1，值为1
- `213`: 第2层，位置1，值为3
- `221`: 第2层，位置2，值为1
- `312`: 第3层，位置1，值为2

## 2. 代码

- 关键点：
	- 递归函数的参数：` traverse(depth, pos, sum) {`
	- mapping
		- key 从 1 开始计数的编号，遇到 null 也会计数，可以是一个满二叉树
			- 父节点在行中的编号为 `x`
				- 则左子节点为下一行的 `2 * x - 1`
				- 右子节点为下一行的 `2 * x`。

```javascript
var pathSum = function (nums) {
    if (!nums.length) return 0;
    const mapping = new Map();
    // 将数组转换为树的形式存储在Map中
    for (const num of nums) {
        let [depth, pos, val] = String(num).split("");
        depth = Number(depth);
        pos = Number(pos);
        val = Number(val);
        let key = depth * 10 + pos;
        mapping.set(key, val);
    }
    let res = 0;
    function traverse(depth, pos, sum) {
        const key = depth * 10 + pos;
        if (!mapping.has(key)) return;
        // 当前路径和
        sum += mapping.get(key);
        // 计算下一层的左右子节点位置
        const leftKey = (depth + 1) * 10 + pos * 2 - 1;
        const rightKey = (depth + 1) * 10 + pos * 2;
        // 如果是叶子节点，加入总和
        if (!mapping.has(leftKey) && !mapping.has(rightKey)) {
            res += sum;
            return;
        }
        // 递归遍历左右子树
        traverse(depth + 1, pos * 2 - 1, sum); // 左子树
        traverse(depth + 1, pos * 2, sum); // 右子树
    }
    traverse(1, 1, 0); // 从根节点开始遍历
    return res;
};
```
