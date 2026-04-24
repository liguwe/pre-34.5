# 二叉树的前中后序遍历详解

## 1. `递归函数` 可以理解为一个 `指针`


![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/45f717821f91cf547c060bc79a4b7a44.png)

## 2. 函数递归顺序是不会变的

**无论哪种遍历方式，函数递归顺序是不会变的**，都是按以下顺序（数字大小代表顺序）遍历，如下图：

![image.png|472](https://832-1310531898.cos.ap-beijing.myqcloud.com/80e97494c5f738af6f0ff737c88a291a.png)

## 3. 前后中序遍历代表三个不同的`时机`

![image.png|584](https://832-1310531898.cos.ap-beijing.myqcloud.com/1c30d9714e7be8b4b354eb5e4e5ebbbd.png)

## 4. 应用：看下图，分别说出`前后中序`的顺序

> 按照 递归函数的调用顺序，遇到`具体颜色`，说出数字即可

![image.png|520](https://832-1310531898.cos.ap-beijing.myqcloud.com/b8eb14ec81e03af7442b8a5b379e31a7.png)

## 5. 应用：根据前中序 `推导出` 原二叉树结构

![image.png|496](https://832-1310531898.cos.ap-beijing.myqcloud.com/ce4a61f186407fa571eaee9f46ea3a32.png)

> - **至少需要根据遍历特性，写出来，纸笔推导出来**

## 6. 应用：计算二叉树的`节点个数`

![image.png|456](https://832-1310531898.cos.ap-beijing.myqcloud.com/51595d1db617d6bb546c0745d43bafa3.png)

## 7. 应用：让二叉树每个节点值 `+1`

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/444d2b0ff7d0723150d4ff54422b4c76.png)

## 8. 总结

- `递归函数` 可以理解为一个 `指针`
- `递归顺序`是不会变的
- `前后中序`是三个不同的`时间点` 或 `时机`
