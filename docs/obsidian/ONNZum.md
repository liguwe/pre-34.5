# 多叉树的遍历： DFS（前中后序遍历）、BFS（层序遍历）

`#多叉树` 


> [!success] 总结
> - 多叉树结构就是 二叉树的延伸，二叉树是特殊的多叉树。
> - **森林是指多个多叉树的集合**。
> - 多叉树的遍历就是 [4. 二叉树的遍历： DFS（前中后序遍历）、BFS（层序遍历）](/t6wKqS) 的延伸

## 森林

- **森林**就是多个多叉树的集合
- 一棵多叉树其实也是一个特殊的**森林**
- 在**并查集算**法中，会用到这个概念

## 二叉树 DFS（前中后序遍历）→ 多叉树的 DFS（前后序）

### 二叉树的遍历框架

```javascript
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

### N 叉树的遍历框架

```javascript
// N 叉树的遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置
    for (var i = 0; i < root.children.length; i++) {
        traverse(root.children[i]);
    }
    // 后序位置
};
```

## 多叉树的BFS（层序遍历）

### 写法一：不记录深度

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

        // 把 cur 的所有子节点加入队列
        for (var child of cur.children) {
            q.push(child);
        }
    }
}
```

### 写法二：记录节点深度

![image.png|680](https://832-1310531898.cos.ap-beijing.myqcloud.com/e80c234bde21ae68b50486fcd25f1061.png)



```javascript hl:21
var levelOrderTraverse = function(root) {
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

            for (var j = 0; j < cur.children.length; j++) {
                q.push(cur.children[j]);
            }
        }
        depth++;
    }
}
```

### 写法三：**带权重边**

基于 [#写法一：不记录深度](/ONNZum#%E5%86%99%E6%B3%95%E4%B8%80%E4%B8%8D%E8%AE%B0%E5%BD%95%E6%B7%B1%E5%BA%A6) 改造下，即可

```javascript
function State(node, depth) {
    this.node = node;
    this.depth = depth;
}

var levelOrderTraverse = function(root) {
    if (root === null) {
        return;
    }
    var q = [];
    // 记录当前遍历到的层数（根节点视为第 1 层）
    q.push(new State(root, 1));

    while (q.length !== 0) {
        var state = q.shift();
        var cur = state.node;
        var depth = state.depth;
        // 访问 cur 节点，同时知道它所在的层数
        console.log("depth = " + depth + ", val = " + cur.val);

        for (var i = 0; i < cur.children.length; i++) {
            q.push(new State(cur.children[i], depth + 1));
        }
    }
}
```


## 相关文章

- [4. 二叉树的遍历： DFS（前中后序遍历）、BFS（层序遍历）](/t6wKqS)
