# 出现次数最多的子树元素和

>  [508. 出现次数最多的子树元素和](https://leetcode.cn/problems/most-frequent-subtree-sum/)


- 注意返回值
	- 最后也一定要返回来
	- 为了方便拼写，后面就直接写 `dfs`
		- 这样也不用想着**如何拼写**了

```javascript hl:14,8
var findFrequentTreeSum = function (root) {
    let mapping = {};
    let res = [];
    
    // 获取每个节点的子元素和
    // 返回值：该元素及所有子节点的和
    function dfs(root) {
        if (!root) return 0;
        // 后序位置
        let left = dfs(root.left);
        let right = dfs(root.right);
        let sum = root.val + left + right;
        mapping[sum] = (mapping[sum] || 0) + 1;
        return sum;
    }
    dfs(root);
    let maxCount = Math.max(...Object.values(mapping));
    let keys = Object.keys(mapping);
    for (let k of keys) {
        if (mapping[k] === maxCount) {
            res.push(parseInt(k));
        }
    }
    return res;
};
```

## 题目

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250120-5.png)
