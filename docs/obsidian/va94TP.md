# IndexedDB

## 1. 总结

-  IndexedDB 严格遵循同源策略（Same-Origin Policy）
- 虽然 IndexedDB 没有像 `localStorage` 那样的内置事件监听机制，但我们可以通过上述方法来实现类似的功能：
	1. 使用**事务和对象存储事件**（局限于单个事务）
	2. 实现 **自定义的发布-订阅模式**
	3. 使用 `Proxy` 或 `Observable` 模式包装 IndexedDB 操作
	4. 利用 `Service Worker` 实现跨标签页的数据变化通知

## 2. IndexedDB 严格遵循同源策略（Same-Origin Policy）

## 3. 能够像 `storage` 一样监听到 indexDB 的数据变化了吗？

> 其实自己也不太常用，说说几种思路即可！

不同于 localStorage 和 sessionStorage，IndexedDB 并没有内置的事件机制来直接监听数据变化。然而，我们可以通过一些技术和模式来实现类似的功能。让我为您详细解释几种方法：

### 3.1. indexdDB 提供的事件： 使用事务（Transaction）和对象存储（Object Store）事件

`IndexedDB` 提供了一些事件，**可以在事务级别监听变化**：

```javascript
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MyDatabase', 1);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('MyStore', { keyPath: 'id' });
        };
    });
}

async function monitorChanges() {
    const db = await openDatabase();
    const transaction = db.transaction(['MyStore'], 'readwrite');
    const store = transaction.objectStore('MyStore');

    store.addEventListener('add', (event) => {
        console.log('数据添加:', event);
    });

    store.addEventListener('put', (event) => {
        console.log('数据更新:', event);
    });

    store.addEventListener('delete', (event) => {
        console.log('数据删除:', event);
    });

    // 使用
    store.add({ id: 1, value: 'test' });
}

monitorChanges();
```

这种方法的局限性在于它只能监听当前事务中的变化。

### 3.2. 使用自定义事件和发布-订阅模式

我们可以创建一个包装器来发出自定义事件：

```javascript
class IndexedDBWrapper {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.listeners = {};
    }

    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            // 处理 onupgradeneeded...
        });
    }

    async put(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.put(data);
        this.emit('change', { type: 'put', storeName, data });
    }

    async delete(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.delete(key);
        this.emit('change', { type: 'delete', storeName, key });
    }

    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    emit(eventName, data) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(data));
        }
    }
}

// 使用示例
async function useIndexedDBWrapper() {
    const dbWrapper = new IndexedDBWrapper('MyDatabase', 1);
    await dbWrapper.open();

    dbWrapper.on('change', (event) => {
        console.log('数据变化:', event);
    });

    await dbWrapper.put('MyStore', { id: 1, value: 'test' });
    await dbWrapper.delete('MyStore', 1);
}

useIndexedDBWrapper();
```

### 3.3. 使用 Proxy 或 Observable 模式

我们可以使用 Proxy 来包装 `IndexedDB` 操作，从而实现自动监听：

```javascript
function createObservableStore(db, storeName) {
    return new Proxy({}, {
        get: (target, prop) => {
            if (prop === 'get') {
                return async (key) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    return await store.get(key);
                };
            }
            if (prop === 'put') {
                return async (data) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    await store.put(data);
                    console.log('数据更新:', data);
                };
            }
            if (prop === 'delete') {
                return async (key) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    await store.delete(key);
                    console.log('数据删除:', key);
                };
            }
        }
    });
}

async function useObservableStore() {
    const db = await openDatabase(); // 假设这个函数已经定义
    const store = createObservableStore(db, 'MyStore');

    await store.put({ id: 1, value: 'test' });
    const data = await store.get(1);
    console.log('获取的数据:', data);
    await store.delete(1);
}

useObservableStore();
```

### 3.4. 使用 Service Worker 进行跨标签页通信

如果需要在多个标签页之间同步 `IndexedDB` 的变化，可以使用 Service Worker：

```javascript
// service-worker.js
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'DB_CHANGE') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                if (client.id !== event.source.id) {
                    client.postMessage(event.data);
                }
            });
        });
    }
});

// main.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

function notifyDBChange(change) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'DB_CHANGE',
            change: change
        });
    }
}

navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'DB_CHANGE') {
        console.log('其他标签页的 IndexedDB 变化:', event.data.change);
    }
});

// 在 IndexedDB 操作后调用
notifyDBChange({ type: 'put', key: 1, value: 'new data' });
```
