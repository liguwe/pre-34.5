# 二叉树的完全性检验：判断完全二叉树

`#层序遍历` 


> [958. 二叉树的完全性检验](https://leetcode.cn/problems/check-completeness-of-a-binary-tree/)


- 层次遍历：[102. 二叉树的层序遍历](/EYXDXq)
	- 第一次遇到 `null` 时，修改 `end = true`
	- 如果后面还能遇到 `null` ，直接返回 `false`，说明不是完全二叉树

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250113-5.png)

```javascript
var isCompleteTree = function (root) {
  let q = [];
  q.push(root);
  // 遍历完所有非空节点时变成 true
  let end = false;
  while (q.length > 0) {
    let sz = q.length;
    for (let i = 0; i < sz; i++) {
      let cur = q.shift();
      // 第一次遇到 null 时 end 变成 true
      // 如果之后的所有节点都是 null，则说明是完全二叉树
      if (cur === null) {
        end = true;
      } else {
        if (end) {
          // end 为 true 时遇到非空节点说明不是完全二叉树
          return false;
        }
        // 将下一层节点放入队列，不用判断是否非空
        q.push(cur.left);
        q.push(cur.right);
      }
    }
  }
  return true;
};
```
