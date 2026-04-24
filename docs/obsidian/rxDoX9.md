# Vue3 中 effect 的调度选项（scheduler）使用示例

`#vue3` `#R1` 


>  平时在使用 vue 来实现业务逻辑时，记得可以通过这种方式来**优化性能**，实现和 React 一样的渲染优先级的调度效果，切记！

## 1. 总结

- 注意 effect 的**详细 API** ，往下看
	- `scheduler` 函数接收原始的 `effect 函数`作为参数
	- `scheduler` 可以控制 `effect` 的执行时机和方式
	- 如果提供了 `scheduler`，effect 的重新执行将由 `scheduler` 来控制
	- scheduler 可以用于实现高级功能如`防抖、节流、异步更新`等
	- 在清理组件时记得`停止 effect 以防内存泄漏`
- 自定义队列调度，更多**看下面示例**
	- 批量调度
	- 优先级调度
	- 防抖等

## 2. 先看看 effect 函数的完整定义、参数、返回值

### 2.1. 完整参数说明

```typescript hl:22
import { effect, reactive } from 'vue'

// 创建响应式对象
const state = reactive({
  count: 0
})

// effect 的完整使用示例
const runner = effect(
  // 第一个参数：效果函数
  () => {
    console.log('count is:', state.count)
    return state.count // 可以有返回值
  },
  
  // 第二个参数：配置选项
  {
    // 是否延迟执行，默认 false
    lazy: false,
    
    // 调度器函数
    scheduler: (run) => {
      console.log('scheduler called')
      run()
    },
    
    // 效果作用域
    scope: undefined,
    
    // 是否允许递归调用，默认 false
    allowRecurse: false,
    
    // 停止时的回调函数
    onStop: () => {
      console.log('effect stopped')
    }
  }
)
```

### 2.2. 返回值详解

```typescript hl:13,14
// runner 函数的使用
const runner = effect(() => {
  return state.count * 2
})

// 1. 直接调用执行效果函数
const result = runner() // 返回计算结果

// 2. 访问 effect 实例
const effectInstance = runner.effect

// 3. 使用 effect 实例的方法
runner.effect.stop() // 停止响应式追踪
runner.effect.run()  // 手动运行效果
```

## 3. 基础使用示例

```javascript hl:11
import { effect, ref } from 'vue'

const count = ref(0)

// 创建一个effect，带有自定义调度器
effect(() => {
  console.log(count.value)
}, {
  scheduler: (run) => {
    // run 是原始的 effect 函数
    console.log('scheduler called')
    // 可以选择何时运行 effect
    run()
  }
})
```

## 4. 异步调度示例

```javascript hl:8
const count = ref(0)

// 将effect执行放入异步队列
effect(() => {
  console.log(count.value)
}, {
  scheduler: (run) => {
    Promise.resolve().then(run)
  }
})
```

## 5. 防抖示例

```javascript hl:11
import { effect, ref } from 'vue'
import { debounce } from 'lodash'

const searchQuery = ref('')

// 创建一个防抖的effect
effect(() => {
  // 搜索逻辑
  console.log('Searching for:', searchQuery.value)
}, {
  scheduler: debounce((run) => {
    run()
  }, 300)
})
```

## 6. 批量更新示例 

```javascript hl:9
const count = ref(0)
let runs = 0

effect(() => {
  console.log(count.value)
}, {
  scheduler: (run) => {
    // 使用 requestAnimationFrame 批量处理更新
    requestAnimationFrame(() => {
      runs++
      console.log(`Running effect, times: ${runs}`)
      run()
    })
  }
})
```

## 7. 批量更新示例 2

```javascript hl:14,9
const list = ref([])
let pending = false
const updates = new Set()

effect(() => {
  console.log('List updated:', list.value)
}, {
  scheduler: (run) => {
    updates.add(run)
    
    if (!pending) {
      pending = true
      Promise.resolve().then(() => {
        updates.forEach(update => update())
        updates.clear()
        pending = false
      })
    }
  }
})

// 批量添加数据
list.value.push(1)
list.value.push(2)
list.value.push(3)
```

## 8. 条件调度示例

```javascript hl:8
const count = ref(0)
let shouldRun = true

effect(() => {
  console.log(count.value)
}, {
  scheduler: (run) => {
    if (shouldRun) {
      run()
    } else {
      console.log('Effect execution skipped')
    }
  }
})
```

## 9. 错误处理

```javascript hl:7
const count = ref(0)

effect(() => {
  console.log(count.value)
}, {
  scheduler: (run) => {
    try {
      run()
    } catch (error) {
      console.error('Effect execution failed:', error)
    }
  }
})
```

## 10. 实际应用场景

```javascript hl:10,24
// 在组件中使用
import { effect, ref, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const data = ref(null)
    let stop

    onMounted(() => {
      // 创建可清理的effect
      stop = effect(() => {
        // 数据处理逻辑
        processData(data.value)
      }, {
        scheduler: (run) => {
          // 使用 requestIdleCallback 在空闲时执行
          requestIdleCallback(() => {
            run()
          })
        }
      })
    })

    onUnmounted(() => {
      // 清理effect
      if (stop) stop()
    })
  }
}
```

## 11. 优先级调度示例 1

```javascript
const highPriorityQueue = []
const lowPriorityQueue = []

const count = ref(0)

effect(() => {
  console.log(count.value)
}, {
  scheduler: (run) => {
    if (isHighPriority()) {
      highPriorityQueue.push(run)
      flushHighPriorityQueue()
    } else {
      lowPriorityQueue.push(run)
      scheduleFlushLowPriorityQueue()
    }
  }
})
```

## 12. 优先级调度示例 2

```javascript hl:12
const data = ref(null)
const loading = ref(false)
const error = ref(null)

// 高优先级更新 - 立即执行
effect(() => {
  console.log('Loading status:', loading.value)
}, {
  scheduler: (run) => run()
})

// 低优先级更新 - 使用 requestIdleCallback
effect(() => {
  console.log('Data processed:', data.value)
}, {
  scheduler: (run) => {
    requestIdleCallback(() => run())
  }
})
```

## 13. 组合调度器示例

```javascript hl:2
// 创建组合调度器
function createCompositeScheduler(...schedulers) {
  return (run) => {
    schedulers.forEach(scheduler => scheduler(run))
  }
}

const count = ref(0)

// 组合防抖和错误处理
effect(() => {
  console.log('Count:', count.value)
}, {
  scheduler: createCompositeScheduler(
    debounce((run) => run(), 300),
    (run) => {
      try {
        run()
      } catch (error) {
        console.error(error)
      }
    }
  )
})
```

## 14. 自定义队列调度示例

```javascript hl:5
class QueueScheduler {
  queue = []
  flushing = false

  add(run) {
    this.queue.push(run)
    this.flush()
  }

  flush() {
    if (this.flushing) return
    this.flushing = true

    Promise.resolve().then(() => {
      while (this.queue.length) {
        const run = this.queue.shift()
        run()
      }
      this.flushing = false
    })
  }
}

const scheduler = new QueueScheduler()

const counter = ref(0)

effect(() => {
  console.log('Counter:', counter.value)
}, {
  scheduler: (run) => scheduler.add(run)
})
```

## 15. 最佳实践

1. 对于频繁更新的数据，使用防抖或节流
2. 对于大量计算，考虑使用异步调度，比如
3. 对于批量更新，使用 `requestAnimationFrame`
4. 需要清理的 `effect` 要在**组件卸载时停止**
5. 合理使用错误处理确保应用稳定性
