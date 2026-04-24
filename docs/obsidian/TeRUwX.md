# chatGPT 是什么

`#AI` `#chatGPT` `#agi`  

## 1. 总结

- chatGPT
	- chat 聊天
	- G：生成
	- P：预训练
	- T：Transformer （模型结构）
- 大模型不是数据库
- 三个训练阶段
	- 无监督学习：给他几 `10T` 的材料
	- 监督学习：
		- 给规范，给好的案例
	- 当数据量足够大时，涌现出了智能
	- 创意引导

## 2. chatGPT是如何回答问题的？  

### 2.1. 自回归生成

![图片|720](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907111029.png)

举个例子：输入`我`，最终返回 `我是一字小小鸟` ，看看大模型的生成过程：

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907111319.png)

- 第一次
	- 输入：我
	- 输出：我是
- 第二次
	- 输入：我是
	- 输出：我是一
- 第三次
	- 输入：我是一
	- 输出：我是一只

### 2.2. 不同的模型影响

![图片|824](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907111829.png)

### 2.3. 两个鹦鹉🦜模型

![图片|760](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907112012.png)

### 2.4. 学习材料的影响

![图片|768](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907112215.png)

### 2.5. GPT 的学习能力（泛化能力）

![图片|856](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907114018.png)

### 2.6. 大模型与数据库的对比

![图片|912](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907114833.png)

## 3. GPT 的三个训练阶段

![图片|784](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907120358.png)

### 3.1. 无监督学习：开卷有益

![图片|848](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907120518.png)

### 3.2. 监督学习：模板规范

![图片|952](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907120656.png)

### 3.3. 意外收获（涌现）

![图片|888](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907121049.png)

有了理解能力，比如，知道**事后诸葛亮**了

![图片|672](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907121454.png)

### 3.4. 强化学习：创意引导

![图片|760](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907121342.png)

## 4. 总结：GPT 的基础原理

![图片|776](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907121705.png)
