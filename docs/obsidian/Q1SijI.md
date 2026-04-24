# 监控二叉树

>  [968. 监控二叉树](https://leetcode.cn/problems/binary-tree-cameras/)

## 思路

1. **节点状态**：我们可以定义每个节点三种状态
    - 0：该节点未被覆盖（没有被监控到）
    - 1：该节点有摄像头
    - 2：该节点已被覆盖（被监控到，但没有摄像头）
2. **贪心策略**：
    - **从低往上**遍历（后序遍历）
    - 尽量在父节点的位置放置摄像头，这样可以监控更多的节点



```javascript hl:7,10,15,20,24
function minCameraCover(root) {
    let res = 0; // 需要的摄像头数量
    // 状态：0-未覆盖，1-有摄像头，2-已覆盖
    function traverse(node) {
        // 空节点认为是已覆盖状态
        if (!node) return 2;
        // 后序遍历
        const left = traverse(node.left); // 左子树的状态
        const right = traverse(node.right); // 右子树的状态
        // 情况1：如果左右子节点有一个未被覆盖，当前节点必须放置摄像头
        if (left === 0 || right === 0) {
            res++; // 放一个摄像头
            return 1; // 返回状态1表示此节点有摄像头
        }
        // 情况2：如果左右子节点至少有一个有摄像头，当前节点已被覆盖
        // 我作为父节点，我的左右节点，只要任何一个安装了摄像头，那么我肯定被覆盖了
        if (left === 1 || right === 1) {
            return 2;
        }
        // 情况3：左右子节点都已被覆盖，当前节点未被覆盖
        return 0;
    }

    // 特殊处理根节点
    if (traverse(root) === 0) {
        res++; // 根节点放一个摄像头
    }

    return res;
}

```
