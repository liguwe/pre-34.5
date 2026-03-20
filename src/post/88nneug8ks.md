
# OpenClaw 命令行拍照功能配置指南

`#年轮` `#log` `#日记`  

> 配置日期：2026-03-16  
> OpenClaw 版本：2026.3.13  
> 系统：macOS 15.7.4

---


## 目录
<!-- toc -->
 ## 功能概述 

通过飞书/钉钉发送消息，调用本地摄像头拍照并将图片发送到 IM 渠道。

```bash
飞书消息 → OpenClaw 网关 → camera_tool.py → camera_service.py → 摄像头
                                              ↓
                                         返回图片路径 (MEDIA:格式)
                                              ↓
                                        OpenClaw 读取并发送图片 → 飞书
```

---

## 前置要求

1. **OpenClaw 已安装并配置**
   - 网关已启动：`openclaw gateway status`
   - 飞书/钉钉渠道已配置

2. **摄像头可用**
   - 内置摄像头或外接 USB 摄像头
   - 已授予终端/Python 摄像头权限

3. **Python 依赖**

   ```bash
   pip3 install opencv-python requests
   ```

---

## 配置步骤

### 步骤 1：创建照片保存目录

**重要**：必须保存到 OpenClaw 允许的目录，否则会出现 `LocalMediaAccessError`。

```bash
# 使用 OpenClaw workspace 目录（在允许列表中）
mkdir -p ~/.openclaw/workspace/camera_photos
```

### 步骤 2：部署相机服务

创建 `~/openclaw/camera_service.py`：

```python hl:16
`#!/usr/bin/env` python3
"""
Camera Service for OpenClaw
通过 HTTP API 提供相机拍照功能
"""

import cv2
import os
import sys
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess

# 配置
# 保存到 OpenClaw 允许的目录（workspace 在允许列表中）
SAVE_DIR = os.path.expanduser("~/.openclaw/workspace/camera_photos")
PORT = 8765

def ensure_dir():
    """确保保存目录存在"""
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)

def capture_with_opencv():
    """使用 OpenCV 拍照"""
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            return None, "无法打开摄像头"

        # 等待摄像头预热
        import time
        time.sleep(1)

        ret, frame = cap.read()
        if not ret:
            return None, "拍照失败"

        # 生成文件名
        filename = f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(SAVE_DIR, filename)

        # 保存图片
        cv2.imwrite(filepath, frame)
        cap.release()

        return filepath, None
    except Exception as e:
        return None, str(e)

def capture_with_imagesnap():
    """使用 imagesnap 拍照（备用方案）"""
    try:
        ensure_dir()
        filename = f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(SAVE_DIR, filename)

        result = subprocess.run(
            ["imagesnap", filepath],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            return filepath, None
        else:
            return None, result.stderr
    except Exception as e:
        return None, str(e)

class CameraHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {args[0]}")

    def do_GET(self):
        if self.path == "/capture" or self.path == "/":
            self.handle_capture()
        elif self.path == "/health":
            self.handle_health()
        else:
            self.send_error(404)

    def handle_capture(self):
        """处理拍照请求"""
        print("📷 收到拍照请求...")

        # 优先使用 OpenCV，失败则使用 imagesnap
        filepath, error = capture_with_opencv()
        if error:
            print(f"OpenCV 失败: {error}, 尝试 imagesnap...")
            filepath, error = capture_with_imagesnap()

        if filepath:
            print(f"✅ 照片已保存: {filepath}")
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            response = {
                "success": True,
                "filepath": filepath,
                "filename": os.path.basename(filepath)
            }
        else:
            print(f"❌ 拍照失败: {error}")
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            response = {
                "success": False,
                "error": error
            }

        self.wfile.write(json.dumps(response).encode())

    def handle_health(self):
        """健康检查"""
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok"}).encode())

def main():
    ensure_dir()

    # 检查摄像头可用性
    print("🔍 检查摄像头...")
    test_path, error = capture_with_opencv()
    if test_path:
        print(f"✅ OpenCV 测试成功: {test_path}")
        os.remove(test_path)
    else:
        print(f"⚠️ OpenCV 不可用: {error}")
        test_path, error = capture_with_imagesnap()
        if test_path:
            print(f"✅ imagesnap 测试成功: {test_path}")
            os.remove(test_path)
        else:
            print(f"❌ imagesnap 也不可用: {error}")
            sys.exit(1)

    print(f"\n🚀 相机服务启动")
    print(f"   地址: http://127.0.0.1:{PORT}")
    print(f"   拍照: http://127.0.0.1:{PORT}/capture")
    print(f"   健康: http://127.0.0.1:{PORT}/health")
    print(f"   保存目录: {SAVE_DIR}\n")

    server = HTTPServer(("127.0.0.1", PORT), CameraHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 服务已停止")
        server.shutdown()

if __name__ == "__main__":
    main()
```

### 步骤 3：创建命令行工具

创建 `~/openclaw/camera_tool.py`：

```python
`#!/usr/bin/env` python3
"""
OpenClaw Camera Tool
调用本地相机服务拍照并返回图片路径
"""

import requests
import sys
import os

CAMERA_SERVICE_URL = "http://127.0.0.1:8765/capture"
# 照片保存目录（OpenClaw 允许的目录）
PHOTO_DIR = os.path.expanduser("~/.openclaw/workspace/camera_photos")

def capture_photo():
    """调用相机服务拍照"""
    try:
        response = requests.get(CAMERA_SERVICE_URL, timeout=15)
        response.raise_for_status()
        data = response.json()

        if data.get("success"):
            filepath = data.get("filepath")
            # MEDIA: 格式是 OpenClaw 识别本地媒体文件的关键
            print(f"MEDIA:{filepath}")
            return filepath
        else:
            print(f"拍照失败: {data.get('error')}", file=sys.stderr)
            return None
    except requests.exceptions.ConnectionError:
        print("❌ 相机服务未启动，请先运行: python3 ~/openclaw/camera_service.py", file=sys.stderr)
        return None
    except Exception as e:
        print(f"❌ 请求失败: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    filepath = capture_photo()
    sys.exit(0 if filepath else 1)
```

### 步骤 4：配置执行权限

编辑 `~/.openclaw/exec-approvals.json`，允许执行 camera_tool.py：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss"
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/Users/liguwe/openclaw/camera_tool.py" }
      ]
    }
  }
}
```

### 步骤 5：启动相机服务

```bash
# 前台运行（调试使用）
python3 ~/openclaw/camera_service.py

# 后台运行
nohup python3 ~/openclaw/camera_service.py > /tmp/camera_service.log 2>&1 &
```

### 步骤 6：测试服务

```bash
# 测试健康检查
curl http://127.0.0.1:8765/health

# 测试拍照
curl http://127.0.0.1:8765/capture
```

---

## 在飞书中使用

### 方式 1：使用 /run 命令

在飞书私聊中发送：

```bash
/run python3 /Users/liguwe/openclaw/camera_tool.py
```

### 方式 2：配置自定义命令（推荐）

在 OpenClaw 配置中定义快捷命令，然后直接发送：

```bash
拍照
```

---

## 踩坑记录

### 坑 1：LocalMediaAccessError - 图片路径不在允许目录

**现象**：飞书收到的是图片地址文本，而不是图片。

日志错误：

```bash
LocalMediaAccessError: Local media path is not under an allowed directory: /Users/liguwe/openclaw/camera_photos/photo_xxx.jpg
```

**原因**：OpenClaw 有安全机制，只允许访问特定目录下的媒体文件。

**解决**：将照片保存到 OpenClaw 允许的目录：
- ✅ `~/.openclaw/workspace/` - 允许
- ❌ `~/openclaw/camera_photos/` - 不允许

**代码修改**：

```python
# 正确的保存目录
SAVE_DIR = os.path.expanduser("~/.openclaw/workspace/camera_photos")
```

---

### 坑 2：MEDIA: 格式必须使用绝对路径

**现象**：OpenClaw 没有识别到媒体文件。

**原因**：`MEDIA:` 后面的路径必须是绝对路径，相对路径不会被识别。

**解决**：

```python
# ✅ 正确 - 绝对路径
print(f"MEDIA:{filepath}")

# ❌ 错误 - 相对路径
print(f"MEDIA:./photo.jpg")
```

---

### 坑 3：相机服务端口被占用

**现象**：启动相机服务时报错 `OSError: [Errno 48] Address already in use`

**解决**：

```bash
# 查找占用进程
lsof -i :8765

# 结束进程
pkill -f camera_service.py

# 重新启动
python3 ~/openclaw/camera_service.py
```

---

### 坑 4：摄像头权限未授权

**现象**：OpenCV 无法打开摄像头，报错 "无法打开摄像头"

**解决**：
1. 打开 **系统设置** → **隐私与安全** → **相机**
2. 确保终端或 Python 有摄像头权限
3. 重启终端

---

### 坑 5：OpenCV 未安装或版本问题

**现象**：导入 cv2 失败

**解决**：

```bash
# 安装 OpenCV
pip3 install opencv-python

# 或使用 imagesnap 作为备用（macOS）
brew install imagesnap
```

---

### 坑 6：exec-approvals.json 配置未生效

**现象**：执行 `/run python3 ~/openclaw/camera_tool.py` 时提示需要权限确认

**解决**：
1. 确保 `exec-approvals.json` 路径正确：`~/.openclaw/exec-approvals.json`
2. 确保 JSON 格式正确（使用绝对路径）
3. 重启 OpenClaw 网关：

   ```bash
   openclaw gateway restart
   ```

---

## 开机自启动配置

创建 LaunchAgent 文件 `~/Library/LaunchAgents/com.openclaw.camera.plist`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.camera</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/python3</string>
        <string>/Users/liguwe/openclaw/camera_service.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

加载服务：

```bash
launchctl load ~/Library/LaunchAgents/com.openclaw.camera.plist
launchctl start com.openclaw.camera
```

---

## 相关文件

| 文件 | 用途 |
|------|------|
| `~/openclaw/camera_service.py` | 相机服务主程序（HTTP API） |
| `~/openclaw/camera_tool.py` | OpenClaw 调用工具（输出 MEDIA:格式） |
| `~/.openclaw/workspace/camera_photos/` | 照片保存目录（必须在允许列表中） |
| `~/.openclaw/exec-approvals.json` | 执行权限配置 |

---

## 故障排查

### 查看日志

```bash
# 相机服务日志
tail -f /tmp/camera_service.log

# OpenClaw 网关日志
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# 搜索图片相关错误
grep -i "camera\|photo\|media\|LocalMediaAccessError" /tmp/openclaw/openclaw-*.log
```

### 手动测试流程

```bash
# 1. 测试相机服务
curl -s http://127.0.0.1:8765/capture

# 2. 测试命令行工具
python3 ~/openclaw/camera_tool.py

# 3. 检查输出格式（必须以 MEDIA: 开头）
# 输出示例：MEDIA:/Users/liguwe/.openclaw/workspace/camera_photos/photo_xxx.jpg

# 4. 检查文件是否存在
ls -la ~/.openclaw/workspace/camera_photos/
```

---

## 总结

关键要点：
1. **照片必须保存到 OpenClaw 允许的目录**（`~/.openclaw/workspace/`）
2. **使用 `MEDIA:` 格式输出绝对路径**（如 `MEDIA:/Users/xxx/.../photo.jpg`）
3. **配置 exec-approvals.json** 允许执行脚本
4. **确保相机服务已启动** 并在后台运行
