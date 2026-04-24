# 本地配置 SSH

`#ssh`

## 如何在 GitHub 上设置 SSH key

### 1. 生成 SSH 密钥对

```bash
# 生成 SSH 密钥，替换为您的 GitHub 邮箱
ssh-keygen -t ed25519 -C "your_email@example.com"

# 如果您使用的是不支持 Ed25519 算法的旧系统，使用：
# ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

当看到提示时：
- 按 Enter 接受默认文件位置（`~/.ssh/id_ed25519`）
- 可以设置密码短语（passphrase），也可以直接按 Enter 不设置

### 2. 启动 SSH-Agent

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 将 SSH 私钥添加到 ssh-agent
ssh-add ~/.ssh/id_ed25519
```

### 3. 复制公钥内容

```bash
# macOS 可以直接复制到剪贴板
pbcopy < ~/.ssh/id_ed25519.pub

# 或者查看公钥内容后手动复制
cat ~/.ssh/id_ed25519.pub
```

### 4. 添加 SSH 密钥到 GitHub 账户

1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧边栏点击 "SSH and GPG keys"
4. 点击 "New SSH key" 或 "Add SSH key"
5. 填写标题（Title）：如 "My Mac"
6. 将复制的公钥内容粘贴到 "Key" 文本框
7. 点击 "Add SSH key" 确认添加

### 5. 测试 SSH 连接

```bash
# 测试连接
ssh -T git@github.com
```

如果看到类似以下消息，说明配置成功：
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### 6. 配置仓库使用 SSH

对于新仓库：
```bash
# 克隆仓库时使用 SSH 地址
git clone git@github.com:username/repository.git
```

对于现有仓库：
```bash
# 查看当前远程仓库地址
git remote -v

# 更改远程仓库地址为 SSH 方式
git remote set-url origin git@github.com:username/repository.git
```

### 常见问题解决：

8. **如果添加私钥时提示权限问题**：
```bash
# 修改私钥文件权限
chmod 600 ~/.ssh/id_ed25519
```

9. **如果需要管理多个 SSH key**：
在 `~/.ssh/config` 文件中添加配置：
```
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
```

10. **如果连接测试失败**：
```bash
# 使用详细模式查看具体错误
ssh -vT git@github.com
```

### 使用建议：

11. 建议为不同的设备生成不同的 SSH 密钥，这样可以更好地管理和控制访问权限
12. 定期检查 GitHub 账户中的 SSH 密钥列表，移除不再使用的密钥
13. 如果担心安全问题，建议设置密钥密码短语
14. 建议使用 Ed25519 算法，它比 RSA 更安全且性能更好

配置完成后，您就可以通过 SSH 方式进行代码推送，无需每次输入用户名和密码，既安全又方便。

## GitHub 的 22 端口时遇到了困难

连接到 GitHub 的 22 端口时遇到了困难，这通常是由于网络限制或防火墙设置导致的。我们可以通过以下几种方法解决：

### 1. 使用 HTTPS 端口（443）替代 SSH 端口（22）

在 `~/.ssh/config` 文件中添加或修改配置，强制使用 443 端口：

```bash
# 编辑或创建 SSH 配置文件
vim ~/.ssh/config
```

添加以下内容：
```
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519  # 或者您的私钥路径
```

### 2. 测试连接

配置完成后，重新测试连接：
```bash
ssh -T git@github.com
# 或者使用详细模式
ssh -vT git@github.com
```

### 3. 如果仍然无法连接，可以尝试以下诊断步骤：

1. **检查 GitHub 服务器状态**
```bash
# 测试 ping
ping github.com

# 或者使用 curl 测试 HTTPS 连接
curl -vI https://github.com
```

2. **检查本地网络设置**
```bash
# 如果使用代理，设置 Git 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890
```

1. **测试不同的 DNS**
```bash
# 使用 nslookup 测试域名解析
nslookup github.com
```

### 4. 如果使用代理软件

如果您使用代理软件（如 Clash、V2Ray 等），确保：

2. 在 SSH 配置文件中添加代理设置：
```
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```

3. 或者在终端设置代理环境变量：
```bash
export ALL_PROXY=socks5://127.0.0.1:7890
```

### 5. 完整的故障排除流程

4. **备份现有 SSH 配置**
```bash
cp ~/.ssh/config ~/.ssh/config.backup
```

5. **清理并重新配置 SSH**
```bash
# 删除现有的 known_hosts
rm ~/.ssh/known_hosts

# 重新生成 SSH 密钥（如果需要）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 确保 SSH agent 运行
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

6. **验证 GitHub SSH 密钥配置**
- 确保您的公钥已正确添加到 GitHub 账户
- 检查私钥权限：
```bash
chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
```

7. **测试不同端口的连接**
```bash
# 测试 443 端口
ssh -T -p 443 git@ssh.github.com

# 测试标准 22 端口
ssh -T git@github.com
```

通常，使用 443 端口（方法 1）是最有效的解决方案，因为：
8. 443 端口通常不会被防火墙阻止
9. 大多数网络环境都允许 HTTPS 流量
10. GitHub 官方支持通过 443 端口进行 SSH 连接

如果以上方法都不能解决问题，建议：
11. 检查是否有防火墙或安全软件阻止连接
12. 咨询网络管理员是否有特殊的网络限制
13. 临时使用 HTTPS 方式进行代码推送（使用个人访问令牌）
