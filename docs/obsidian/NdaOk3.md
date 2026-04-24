# 验证二叉树的前序序列化

> [331. 验证二叉树的前序序列化](https://leetcode.cn/problems/verify-preorder-serialization-of-a-binary-tree/)



- 每个节点都会占用一个`槽位`
- `非空节点`会产生两个新的槽位
	- 给左右子节点使用
- 空节点（"#"）不会产生新的槽位

```javascript
var isValidSerialization = function (preorder) {
    // 将字符串转换为节点数组
    const nodes = preorder.split(",");
    let slots = 1; // 可用的槽位数量

    for (const node of nodes) {
        // 每个节点都会占用一个槽位
        slots--;

        // 如果槽位小于0，说明序列无效
        if (slots < 0) {
            return false;
        }

        // 如果不是空节点("#")，则会产生两个新的槽位
        if (node !== "#") {
            slots += 2;
        }
    }

    // 最后槽位数量必须为0
    return slots === 0;
};

```
