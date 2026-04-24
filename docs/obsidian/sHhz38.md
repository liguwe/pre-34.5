# 其他树结构

- 红黑树是**自平衡的二叉搜索树**
	- 它的树高在任何时候都能保持在 `O(log⁡N)`（完美平衡）
	- 这样就能保证增删查改的时间复杂度都是 `O(log⁡N)`
- Trie 树就是 [多叉树结构](https://labuladong.online/algo/data-structure-basic/n-ary-tree-traverse-basic/) 的延伸
	- 是一种针对**字符串**进行特殊优化的数据结构
	- Trie 树在处理字符串相关操作时有诸多优势
		- 比如节省公共字符串前缀的内存空间、方便处理前缀操作、支持通配符匹配等
- `HashMap` 底层把键值对存储在一个 `table` 数组里面
- 而 `TreeMap` 底层把**键值对**存储在一棵**二叉搜索树的节点**里面
- `TreeSet`
	- 它和 `TreeMap` 的关系正如哈希表 `HashMap` 和哈希集合 `HashSet` 的关系一样
	- 说白了就是 `TreeMap` 的简单封装
