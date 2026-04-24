# Vue3 的 Diff 算法复杂的分析

`#diff` `#vue3` 

>  另外可见 [41. React 的 Diff 算法](/XXFU25)

## 1. 总结

- Vue3 的 Diff 算法通过多个步骤将时间复杂度从 `O(n³)` 优化到 `O(n)`
	- ① 只比较同层级节点，不跨层级比较
	- ② 使用 key 作为索引
	- ③ 预处理：快速路径
		- 头尾节点快速比对
	- ④ 进一步优化：
		- 使用**最长递增子序列**减少节点移动

> 和 React 的优化思路类似，但 React 不是`双端比较`，也是不是`快速 Diff 算法`，而是`仅右移`

## 2. **最初的树 Diff 问题**

```js
// 最原始的树 Diff 算法（O(n³)复杂度）
function originalTreeDiff(oldTree, newTree) {
  for (let i = 0; i < oldTree.length; i++) {      // O(n)
    for (let j = 0; j < newTree.length; j++) {    // O(n)
      findMinimumOperations(oldTree[i], newTree[j]) // O(n)
    }
  }
}
```

## 3. **第一步优化：层级比较**

```js
// 只比较同层级节点，不跨层级比较
function levelByLevelDiff(oldChildren, newChildren) {
  // 只比较同一层级的节点
  for (let i = 0; i < oldChildren.length; i++) {
    for (let j = 0; j < newChildren.length; j++) {
      if (oldChildren[i].key === newChildren[j].key) {
        patch(oldChildren[i], newChildren[j])
      }
    }
  }
}
```

## 4. **第二步优化：使用 key 作为索引**

```js
// 使用 key 建立映射，避免无效比较
function keyBasedDiff(oldChildren, newChildren) {
  const oldKeyToIdx = {}
  
  // 建立 key 到索引的映射 O(n)
  for (let i = 0; i < oldChildren.length; i++) {
    oldKeyToIdx[oldChildren[i].key] = i
  }
  
  // 直接通过 key 找到对应节点 O(1)
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    const oldIndex = oldKeyToIdx[newChild.key]
    if (oldIndex !== undefined) {
      patch(oldChildren[oldIndex], newChild)
    }
  }
}
```

## 5. **第三步优化：快速路径**

```js
function fastPathDiff(oldChildren, newChildren) {
  let i = 0
  const len = Math.min(oldChildren.length, newChildren.length)
  
  // 1. 从头部开始比对 O(n)
  while (i < len && oldChildren[i].key === newChildren[i].key) {
    patch(oldChildren[i], newChildren[i])
    i++
  }
  
  let oldEnd = oldChildren.length - 1
  let newEnd = newChildren.length - 1
  
  // 2. 从尾部开始比对 O(n)
  while (oldEnd >= i && newEnd >= i && oldChildren[oldEnd].key === newChildren[newEnd].key) {
    patch(oldChildren[oldEnd], newChildren[newEnd])
    oldEnd--
    newEnd--
  }
  
  // 3. 处理剩余节点
  if (i > oldEnd) {
    // 添加新节点
    for (let j = i; j <= newEnd; j++) {
      mount(newChildren[j])
    }
  } else if (i > newEnd) {
    // 删除多余节点
    for (let j = i; j <= oldEnd; j++) {
      unmount(oldChildren[j])
    }
  }
}
```

## 6. **最终优化：最长递增子序列**

```js
function optimizedDiff(oldChildren, newChildren) {
  // ... 前面的快速路径处理 ...
  
  // 对剩余节点进行处理
  const remainingOldChildren = oldChildren.slice(i, oldEnd + 1)
  const remainingNewChildren = newChildren.slice(i, newEnd + 1)
  
  // 建立 key 到位置的映射
  const keyToNewIndexMap = new Map()
  for (let i = 0; i < remainingNewChildren.length; i++) {
    keyToNewIndexMap.set(remainingNewChildren[i].key, i)
  }
  
  // 找到最长递增子序列
  const newIndexToOldIndexMap = new Array(remainingNewChildren.length)
  for (let i = 0; i < remainingOldChildren.length; i++) {
    const newIndex = keyToNewIndexMap.get(remainingOldChildren[i].key)
    if (newIndex !== undefined) {
      newIndexToOldIndexMap[newIndex] = i
    }
  }
  
  // 获取最长递增子序列的索引
  const increasingSequence = getSequence(newIndexToOldIndexMap)
  
  // 从后向前遍历，移动节点
  let j = increasingSequence.length - 1
  for (let i = remainingNewChildren.length - 1; i >= 0; i--) {
    if (j < 0 || i !== increasingSequence[j]) {
      // 需要移动的节点
      move(remainingNewChildren[i], container, anchor)
    } else {
      // 不需要移动的节点
      j--
    }
  }
}

// 获取最长递增子序列
function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
```

## 7. **优化的核心策略**

- **空间换时间**：
	- 使用 Map 存储 key-index 映射
- **预处理优化**：
	- 头尾节点快速比对
- **算法优化**：
	- 使用最长递增子序列减少节点移动
- **分治思想**：
	- 将问题分解为更小的子问题

## 8. **时间复杂度分析**

```js
// 最终的时间复杂度分析
function diffComplexity(oldChildren, newChildren) {
  // 1. 建立 key-index 映射：O(n)
  // 2. 头尾节点快速比对：O(n)
  // 3. 查找最长递增子序列：O(nlogn)
  // 4. 根据最长递增子序列移动节点：O(n)
  
  // 总体时间复杂度：O(nlogn)
  // 在实际应用中，由于大多数情况下变更都很小，
  // 实际性能接近 O(n)
}
```

## 9. 总结

- **算法层面**：
	- 只比较**同层级**节点
	- 使用 key 作为唯一标识
	- 采用双端比较
	- 使用最长递增子序列优化移动
- **实现层面**：
	- 空间换时间
	- 预处理优化
	- 快速路径处理
	- 分治思想
- **特殊情况处理**：
	- 新增节点
	- 删除节点
	- 移动节点
	- 更新节点

这些优化策略综合使用，使得 **Vue3 的 Diff 算法在实际应用中能够达到接近线性的时间复杂度**，大大提升了性能。
