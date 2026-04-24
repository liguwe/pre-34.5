# 二叉树的遍历： DFS（前中后序遍历）、BFS（层序遍历）

`#二叉树` 

## 1. DFS（前中后序遍历）→ 递归遍历

```javascript hl:6,8,10
// 二叉树的遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置
    traverse(root.left);
    // 中序位置
    traverse(root.right);
    // 后序位置
};
```

>  关于前后中序遍历的，详见 [22. 二叉树的前中后序遍历详解](/TMfgtO)

## 2. BFS（层序遍历）

### 2.1. 写法一：无法知道**当前节点在第几层**，所以平时不常用

```javascript
var levelOrderTraverse = function(root) {
    if (root === null) {
        return;
    }
    var q = [];
    q.push(root);
    while (q.length !== 0) {
        var cur = q.shift();
        // 访问 cur 节点
        console.log(cur.val);

        // 把 cur 的左右子节点加入队列
        if (cur.left !== null) {
            q.push(cur.left);
        }
        if (cur.right !== null) {
            q.push(cur.right);
        }
    }
}
```

### 2.2. 写法二： 最常用的，**知道每个节点在第几层**

下图完美展示层次遍历：
- while
	- for

![image.png|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/e80c234bde21ae68b50486fcd25f1061.png)


```javascript hl:25,12
var levelOrderTraverse = function (root) {
  if (root === null) {
    return;
  }
  var q = [];
  q.push(root);
  // 记录当前遍历到的层数（根节点视为第 1 层）
  var depth = 1;

  while (q.length !== 0) {
    var sz = q.length;
    for (var i = 0; i < sz; i++) {
      var cur = q.shift();
      // 访问 cur 节点，同时知道它所在的层数
      console.log("depth = " + depth + ", val = " + cur.val);

      // 把 cur 的左右子节点加入队列
      if (cur.left !== null) {
        q.push(cur.left);
      }
      if (cur.right !== null) {
        q.push(cur.right);
      }
    }
    depth++;
  }
};

```

### 2.3. 写法三：队列的每个元素是**带权重的**

- **在写法一的基础上**添加一个 `State` 类，**让每个节点自己负责维护自己的路径权重和**
- `depth` 相等于权重，根节点的权重为 1
	- 注意下面的代码注释 → `cur.depth + 1` 

```javascript hl:21,24
function State(node, depth) {
  this.node = node;
  this.depth = depth;
}

var levelOrderTraverse = function (root) {
  if (root === null) {
    return;
  }
  var q = [];
  // 根节点的路径权重和是 1
  q.push(new State(root, 1));

  while (q.length !== 0) {
    var cur = q.shift();
    // 访问 cur 节点，同时知道它的路径权重和
    console.log("depth = " + cur.depth + ", val = " + cur.node.val);

    // 把 cur 的左右子节点加入队列
    if (cur.node.left !== null) {
      q.push(new State(cur.node.left, cur.depth + 1));
    }
    if (cur.node.right !== null) {
      q.push(new State(cur.node.right, cur.depth + 1));
    }
  }
};

```


## 相关文章

- [4. 图的 DFS 遍历](/u4ScR1)
- [5. 图的 BFS 遍历](/2q6EoH)
