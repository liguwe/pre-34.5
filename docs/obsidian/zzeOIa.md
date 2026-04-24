# 字母异位词分组：按字母异位词分组

`#leetcode` `#算法/哈希` `#done` 

## 1. 总结

- 哈希 + `charCodeAt`

## 2. 题目及理解

> 49. 字母异位词分组


![image.png600|704](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407281620623.png?imageSlim)

## 3. 解题思路

- 先分组：按照由同相同字母组合成的单词来分组
   - 使用 `hash` 特定的 `key 值` 来分组
- 然后再把`分组后的 hash` 转成 `二维数组`

## 4. 代码实现

```javascript
var groupAnagrams = function (strs) {
  // 编码到分组的映射
  let codeToGroup = new Map();
  for (let s of strs) {
    // 对字符串进行编码
    let code = encode(s);
    // 把编码相同的字符串放在一起
    if (!codeToGroup.has(code)) {
      codeToGroup.set(code, []);
    }
    codeToGroup.get(code).push(s);
  }

  // 获取结果
  let res = [];
  for (let group of codeToGroup.values()) {
    res.push(group);
  }

  return res;
};

/*
 * @description: 利用每个字符的出现次数进行编码
 * @param {string} s
 * @return {string}
 * @example 1: encode("abc") => "1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
 * @example 2: encode("abbccc") => "1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
 * @example 3: encode("aabbcc") => "2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
 */
function encode(s) {
  // 初始化一个长度为 26 的数组，用于记录每个字符的出现次数
  let arr = new Array(26).fill(0);
  for (let c of s) {
    // 返回 c 的 Ascii 码值, 减去 'a' 的 Ascii 码值, 得到 c 相对于 'a' 的偏移量
    // 即 a -> 0, b -> 1, c -> 2, ..., z -> 25
    let delta = c.charCodeAt() - "a".charCodeAt();
    // 更新字符 c 的出现次数
    arr[delta]++;
  }
  return arr.toString();
}

```

## 5. 错误记录
