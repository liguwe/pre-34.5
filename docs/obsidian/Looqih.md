# JavaScript 异步编程：Thunk 函数

`#javascript` 

## 1. 基本定义：**延迟函数执行**

   
Thunk 是一个被包裹在另一个函数中的函数，通常**用于延迟一个计算或操作的执行**。

> Thunk function 在异步编程和函数式编程中经常使用

## 2. 主要特点

   - 延迟执行：Thunk 允许你推迟一段代码的执行。
   - 封装复杂性：它可以封装复杂的逻辑，使代码更清晰。
   - 参数传递：可以在不立即执行函数的情况下传递参数。

## 3. 在异步编程中的应用

Thunk 在处理异步操作时特别有用，尤其是在 `Redux` 等状态管理库中

### 3.1. 基本的 thunk 示例

```javascript
// 普通函数
function add(x, y) {
  return x + y;
}

// Thunk 函数
function addThunk(x, y) {
  return function() {
    return x + y;
  };
}

console.log(add(2, 3));        // 输出: 5
console.log(addThunk(2, 3));   // 输出: [Function]
console.log(addThunk(2, 3)()); // 输出: 5
```

### 3.2. 在异步操作中使用 thunk

```javascript
function fetchUserData(userId) {
  return function(dispatch) {
    dispatch({ type: 'FETCH_USER_REQUEST' });
    
    fetch(`https://api.example.com/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: data });
      })
      .catch(error => {
        dispatch({ type: 'FETCH_USER_FAILURE', error });
      });
  };
}

// 使用
store.dispatch(fetchUserData(123));
```

在这个例子中，`fetchUserData` 返回一个函数（thunk），而不是一个普通的 action 对象。

这个返回的函数接收 `dispatch` 作为参数，允许在异步操作完成后再次派发 action。

### 3.3. Thunk 在 Redux 中的应用

在 Redux 中，action 创建器通常返回一个普通的 JavaScript 对象。但是，使用 Redux Thunk 中间件后，action 创建器可以返回一个函数，这个函数就是一个 thunk。

```javascript
// 配置 Redux Thunk
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// 使用 thunk action 创建器
const fetchPosts = (subreddit) => (dispatch) => {
  dispatch(requestPosts(subreddit));
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(subreddit, json)));
};

// 派发 thunk
store.dispatch(fetchPosts('reactjs'));
```

## 4. 总结

- Thunk 函数是一种`延迟执行`的函数。
- 在异步编程中，thunk 可以帮助管理复杂的异步流程
- 在 Redux 等状态管理库中，thunk 用于**处理异步 action**。
- `Thunk` 提供了一种方式来封装复杂的逻辑，使代码更加模块化和可测试

通过使用 thunk，我们可以更灵活地控制函数的执行时机，特别是在处理异步操作或需要访问 Redux store 的情况下
