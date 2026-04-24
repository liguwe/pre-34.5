# SKU 排列

`#回溯算法` 

## 1. 总结

- 关键：两个参数
	- track 
	- idx

```javascript
function fn(...skus) {
  let n = skus.length;
  let res = [];
  function backtrack(track, idx) {
    if (track.length === n) {
      res.push([...track]);
      return;
    }
    let opts = skus[idx];
    for (let item of opts) {
      track.push(item);
      backtrack(track, idx + 1);
      track.pop();
    }
  }
  backtrack([], 0);
  return res;
}
```

## 2. 分析

 - 参数：
	 - `backtrack = (路径, 选择列表, index)`
		 - 路径
		 - 选择列表
		 - index 
			 - 额外的参数，代表选中第几种规格
 

```javascript hl:20
let names = ["iPhone X", "iPhone XS"]
let colors = ["黑色", "白色"]
let storages = ["64g", "256g"]
let skus = {names,colors,storages};

// [
//     ["iPhone X", "黑色", "64g"],
//     ["iPhone X", "黑色", "256g"],
//     ["iPhone X", "白色", "64g"],
//     ["iPhone X", "白色", "256g"],
//     ["iPhone XS", "黑色", "64g"],
//     ["iPhone XS", "黑色", "256g"],
//     ["iPhone XS", "白色", "64g"],
//     ["iPhone XS", "白色", "256g"],
// ]

let combine = function (...skus) {
    let res = [];
    const backtrack = (opts, selectedArr, index) => {
        // 取下一个 sku
        let options = opts[index];
        if (selectedArr.length === 3) {
            res.push([...selectedArr]);
            return;
        }

		// 根据当前 sku 的可选项进行遍历
        for (let i = 0; i < options.length; i++) {
            // 选择
            selectedArr.push(options[i]);
            
            // ::::关键，选择下一个产品类型，即下一个数组
            
            backtrack(skus, selectedArr, index + 1);
            
            // 取消选择
            selectedArr.pop();
        }
    }
    backtrack(skus, [], 0)
    return res
}

console.log(combine(names, colors, storages));

```

> **关键点**，递归函数 `backtrack` 的入参上，即 `opts, selectedArr, index` 这三个参数上。
