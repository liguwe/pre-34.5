# 扁平化嵌套列表迭代器：惰性展开多叉树

>  [341. 扁平化嵌套列表迭代器](https://leetcode.cn/problems/flatten-nested-list-iterator/)

- 其实就是一个多叉树遍历，没什么特别的
- 和扁平化化数组没有什么区别
- 只不过
	- `root.isInteger()` 代表到达叶子结点
	- `root.getList()` 代表 `root.children`

```javascript
var NestedIterator = function(nestedList) {
    var result = [];
    // 遍历以 root 为根的多叉树，将叶子节点的值加入 result 列表
    var traverse = function(root) {
        if (root.isInteger()) {
            // 到达叶子节点
            result.push(root.getInteger());
            return;
        }
        // 遍历框架
        for (var child of root.getList()) {
            traverse(child);
        }
    }
    for (var node of nestedList) {
        // 以每个节点为根遍历
        traverse(node);
    }
    this.index = 0;
    this.result = result;
};

NestedIterator.prototype.hasNext = function() {
    return this.index < this.result.length;
};

NestedIterator.prototype.next = function() {
    return this.result[this.index++];
};
```
