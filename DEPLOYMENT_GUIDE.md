# OptionFlow PM2 部署指南

## 快速开始

### 1. 安装 PM2（如果尚未安装）
```bash
npm install -g pm2
```

### 2. 修改配置文件
编辑 `ecosystem.config.js` 文件，将 `/path/to/your/OptionTools` 替换为你的实际项目路径：

```javascript
cwd: '/your/actual/project/path',
```

### 3. 运行部署脚本
```bash
./deploy.sh
```

## 脚本功能

### 主要特性
- ✅ 自动检查依赖（Node.js, npm, PM2）
- ✅ 安装项目依赖
- ✅ 构建项目
- ✅ 管理 PM2 进程
- ✅ 健康检查
- ✅ 开机自启设置
- ✅ 彩色日志输出

### 支持命令
```bash
# 完整部署（默认）
./deploy.sh deploy

# 启动应用
./deploy.sh start

# 停止应用
./deploy.sh stop

# 重启应用
./deploy.sh restart

# 查看状态
./deploy.sh status

# 查看日志
./deploy.sh logs

# 显示帮助
./deploy.sh help
```

## PM2 配置说明

### 进程配置
- **名称**: optionflow
- **端口**: 3000
- **主机**: 0.0.0.0（允许外部访问）
- **内存限制**: 500MB
- **自动重启**: 启用
- **日志文件**: `./logs/` 目录

### 环境变量
- **生产环境**: NODE_ENV=production
- **开发环境**: NODE_ENV=development

## 日志管理

### 查看日志
```bash
# 实时日志
pm2 logs optionflow

# 最近20行日志
pm2 logs optionflow --lines 20

# 错误日志
pm2 logs optionflow --err

# 标准输出日志
pm2 logs optionflow --out
```

### 日志文件位置
- **错误日志**: `./logs/err.log`
- **标准输出**: `./logs/out.log`
- **合并日志**: `./logs/combined.log`

## 进程管理

### 基本命令
```bash
# 查看状态
pm2 status

# 停止应用
pm2 stop optionflow

# 重启应用
pm2 restart optionflow

# 删除应用
pm2 delete optionflow

# 监控资源使用
pm2 monit
```

### 开机自启
部署脚本会自动设置 PM2 开机自启，如果需要手动设置：
```bash
pm2 startup
pm2 save
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -tulpn | grep :3000
   
   # 修改端口
   # 编辑 ecosystem.config.js 中的 port 配置
   ```

2. **权限问题**
   ```bash
   # 给脚本执行权限
   chmod +x deploy.sh
   ```

3. **PM2 未找到**
   ```bash
   # 全局安装 PM2
   npm install -g pm2
   ```

4. **构建失败**
   ```bash
   # 检查依赖
   npm install
   
   # 手动构建
   npm run build
   ```

### 查看详细日志
```bash
# PM2 日志
pm2 logs optionflow --lines 100

# 系统日志
journalctl -u pm2-root -f
```

## 性能优化

### 内存优化
- 自动重启内存超过 500MB 的进程
- 监控内存使用情况：`pm2 monit`

### 多实例部署（可选）
如果需要部署多个实例，修改 `ecosystem.config.js`：
```javascript
instances: 2,  // 启动2个实例
exec_mode: 'cluster',  // 集群模式
```

## 安全建议

1. **使用防火墙**限制对应用端口的访问
2. **定期更新** Node.js 和依赖包
3. **监控日志**及时发现异常
4. **备份配置**文件和数据库

## 更新应用

### 平滑更新
```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deploy.sh
```

### 快速重启
```bash
# 仅重启进程（不重新构建）
pm2 restart optionflow
```

## 联系支持

如果遇到问题，请检查：
1. PM2 日志：`pm2 logs optionflow`
2. 系统日志：`journalctl -xe`
3. 应用日志：`./logs/` 目录下的文件