# WebAssembly (Wasm)

`#bom` 

## 1. WebAssembly 基本概念

WebAssembly 是一种低级的**二进制格式**，可以在现代浏览器中运行，提供接近原生的性能。主要特点：

- 快速执行
- **跨平台**
- 支持多种编程语言（C++、Rust、Go等）
- 与JavaScript 互操作
- **安全的沙箱环境**

## 2. 基本使用示例（使用Rust）：fib

````rust
// Rust代码 (lib.rs)
use wasm_bindgen::prelude::*;

`#[wasm_bindgen]`
pub fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}
````

对应的JavaScript调用：

````javascript
import init, { fibonacci } from './pkg/my_wasm.js';

async function run() {
    await init();
    console.log(fibonacci(10)); // 输出第10个斐波那契数
}

run();
````

## 3. 常见使用案例

### 3.1. 图像处理

````rust
// Rust代码
`#[wasm_bindgen]`
pub fn apply_grayscale(data: &mut [u8]) {
    for pixel in data.chunks_mut(4) {
        let avg = (pixel[0] as u32 + pixel[1] as u32 + pixel[2] as u32) / 3;
        pixel[0] = avg as u8;
        pixel[1] = avg as u8;
        pixel[2] = avg as u8;
    }
}
````

JavaScript调用：

````javascript
async function processImage(imageData) {
    const { memory, apply_grayscale } = await init();
    
    // 创建共享内存
    const array = new Uint8ClampedArray(memory.buffer, imageData.data.byteOffset, imageData.data.length);
    
    // 处理图像
    apply_grayscale(array);
    
    // 更新canvas
    ctx.putImageData(imageData, 0, 0);
}
````

### 3.2. 游戏引擎

````rust
// Rust游戏逻辑
`#[wasm_bindgen]`
pub struct GameState {
    players: Vec<Player>,
    world: World,
}

`#[wasm_bindgen]`
impl GameState {
    pub fn new() -> GameState {
        // 初始化游戏状态
    }

    pub fn update(&mut self) {
        // 更新游戏逻辑
    }

    pub fn render(&self) -> Vec<u8> {
        // 返回渲染数据
    }
}
````

JavaScript集成：

````javascript
import { GameState } from './pkg/game_wasm.js';

class Game {
    constructor() {
        this.gameState = GameState.new();
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    gameLoop() {
        this.gameState.update();
        const renderData = this.gameState.render();
        this.draw(renderData);
        requestAnimationFrame(() => this.gameLoop());
    }
}
````

### 3.3. 音频处理

````rust
`#[wasm_bindgen]`
pub struct AudioProcessor {
    buffer: Vec<f32>,
}

`#[wasm_bindgen]`
impl AudioProcessor {
    pub fn new() -> AudioProcessor {
        AudioProcessor {
            buffer: Vec::new(),
        }
    }

    pub fn process_audio(&mut self, samples: &[f32]) -> Vec<f32> {
        // 音频处理逻辑
        samples.iter().map(|&x| x * 0.5).collect()
    }
}
````

JavaScript音频处理：

````javascript hl:3
class AudioHandler {
    async init() {
        const { AudioProcessor } = await import('./pkg/audio_wasm.js');
        this.processor = AudioProcessor.new();
        
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        const processor = audioContext.createScriptProcessor(2048, 1, 1);
        
        processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const output = e.outputBuffer.getChannelData(0);
            
            // 使用WASM处理音频
            const processed = this.processor.process_audio(input);
            output.set(processed);
        };
    }
}
````

### 3.4. 密码学应用

````rust
`#[wasm_bindgen]`
pub fn hash_password(password: &str, salt: &str) -> String {
    use argon2::{self, Config};
    
    let config = Config::default();
    argon2::hash_encoded(
        password.as_bytes(),
        salt.as_bytes(),
        &config
    ).unwrap()
}
````

JavaScript使用：

````javascript
async function hashPassword(password) {
    const { hash_password } = await init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return hash_password(password, salt);
}
````

### 3.5. 3D渲染

````rust
`#[wasm_bindgen]`
pub struct Renderer {
    vertices: Vec<f32>,
    indices: Vec<u32>,
}

`#[wasm_bindgen]`
impl Renderer {
    pub fn new() -> Renderer {
        Renderer {
            vertices: Vec::new(),
            indices: Vec::new(),
        }
    }

    pub fn render_scene(&self) -> Vec<u8> {
        // 3D渲染逻辑
    }
}
````

与WebGL集成：

````javascript
class Scene {
    async init() {
        const { Renderer } = await import('./pkg/renderer_wasm.js');
        this.renderer = Renderer.new();
        
        const gl = canvas.getContext('webgl');
        // 设置WebGL上下文
        
        this.animate();
    }
    
    animate() {
        const renderData = this.renderer.render_scene();
        // 更新WebGL缓冲区
        requestAnimationFrame(() => this.animate());
    }
}
````

## 4. 性能优化建议

````javascript hl:1,5,9,17
// 1. 避免频繁的内存复制
const memory = new WebAssembly.Memory({ initial: 10 });
const sharedArray = new Uint8Array(memory.buffer);

// 2. 使用Web Workers
const worker = new Worker('wasm-worker.js');
worker.postMessage({ type: 'init' });

// 3. 批量处理数据
function batchProcess(data, batchSize = 1000) {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        wasmModule.processBatch(batch);
    }
}

// 4. 使用共享内存
const shared = new SharedArrayBuffer(1024);
const sharedInt32 = new Int32Array(shared);
````

## 5. 最佳实践

- 将计算密集型任务交给 WebAssembly
- 保持JavaScript接口简单清晰
- 适当使用 Web Workers
- 注意内存管理
- 优化数据传输
- 使用适当的工具链（wasm-pack、emscripten等）
- 进行性能测试和对比

## 6. 实际案例

- a. AutoCAD Web：
	- 将复杂的 CAD 软件移植到网页
	- 实现接近桌面级的性能
	- 支持大型工程图纸处理
- b. Google Earth：
	- 3D 地图渲染
	- 复杂地理数据处理
	- 流畅的用户交互
- c. **Figma**：
	- 实时图形处理
	- 复杂的布局计算
	- 快速的界面响应
- Unity WebGL：
	- 游戏引擎通过 WebAssembly 部署到网页
- Autodesk AutoCAD Web：
	- 使用 C++ 编译到 WebAssembly
- Photoshop Web 版本使用 WebAssembly

## 7. WebAssembly 特别适合

- 游戏开发
- 图像/视频处理
- 3D渲染
- 科学计算
- 加密算法
- 音频处理
- 模拟器
- 大数据处理
- 需要高性能的 Web 应用
- 现有原生应用的 Web 迁移

通过合理使用WebAssembly，可以显著提升Web应用的性能，特别是在计算密集型任务中。
