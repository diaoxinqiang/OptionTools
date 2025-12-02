#!/bin/bash

# OptionFlow PM2 部署脚本
# 用于构建和部署 OptionFlow 期权定价可视化应用

set -e

echo "🚀 OptionFlow PM2 部署脚本启动..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查必要工具
check_requirements() {
    info "检查必要工具..."
    
    check_command "node"
    check_command "npm"
    check_command "pm2"
    
    success "所有必要工具已安装"
}

# 安装依赖
install_dependencies() {
    info "安装项目依赖..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    success "依赖安装完成"
}

# 构建项目
build_project() {
    info "构建项目..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        success "项目构建成功"
    else
        error "项目构建失败"
        exit 1
    fi
}

# 检查PM2配置文件
check_pm2_config() {
    if [ ! -f "pm2.config.js" ] && [ ! -f "pm2.json" ] && [ ! -f "ecosystem.config.js" ]; then
        warning "未找到PM2配置文件，将使用默认配置"
        return 1
    fi
    return 0
}

# 停止现有进程
stop_existing_process() {
    info "停止现有的 OptionFlow 进程..."
    
    pm2 stop optionflow 2>/dev/null || true
    pm2 delete optionflow 2>/dev/null || true
    
    success "已停止现有进程"
}

# 启动应用
start_application() {
    info "启动 OptionFlow 应用..."
    
    # 使用PM2配置文件或默认配置
    if check_pm2_config; then
        if [ -f "pm2.config.js" ]; then
            pm2 start pm2.config.js
        elif [ -f "pm2.json" ]; then
            pm2 start pm2.json
        elif [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js
        fi
    else
        # 默认配置
        pm2 start npm --name "optionflow" -- run preview -- --port 3000 --host 0.0.0.0
    fi
    
    if [ $? -eq 0 ]; then
        success "OptionFlow 应用启动成功"
    else
        error "OptionFlow 应用启动失败"
        exit 1
    fi
}

# 保存PM2配置
save_pm2_config() {
    info "保存PM2配置..."
    
    pm2 save
    
    success "PM2配置已保存"
}

# 设置开机自启
setup_startup() {
    info "设置PM2开机自启..."
    
    pm2 startup
    
    success "开机自启设置完成"
}

# 显示状态
show_status() {
    info "显示应用状态..."
    
    pm2 status
    
    echo ""
    success "OptionFlow 部署完成！"
    echo ""
    info "应用信息："
    echo "  名称: optionflow"
    echo "  端口: 3000"
    echo "  主机: 0.0.0.0"
    echo ""
    info "常用命令："
    echo "  pm2 status          - 查看状态"
    echo "  pm2 logs optionflow  - 查看日志"
    echo "  pm2 stop optionflow  - 停止应用"
    echo "  pm2 restart optionflow - 重启应用"
    echo "  pm2 delete optionflow - 删除应用"
}

# 健康检查
health_check() {
    info "进行健康检查..."
    
    sleep 3
    
    if pm2 status | grep -q "optionflow.*online"; then
        success "应用运行正常"
    else
        error "应用可能未正常运行，请检查日志"
        pm2 logs optionflow --lines 20
        exit 1
    fi
}

# 主函数
main() {
    echo "========================================"
    echo "    OptionFlow PM2 部署脚本"
    echo "========================================"
    echo ""
    
    # 检查是否在项目根目录
    if [ ! -f "package.json" ]; then
        error "请在项目根目录运行此脚本"
        exit 1
    fi
    
    # 执行部署步骤
    check_requirements
    install_dependencies
    build_project
    stop_existing_process
    start_application
    save_pm2_config
    setup_startup
    health_check
    show_status
}

# 处理命令行参数
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "start")
        start_application
        ;;
    "stop")
        stop_existing_process
        ;;
    "restart")
        stop_existing_process
        start_application
        ;;
    "status")
        pm2 status
        ;;
    "logs")
        pm2 logs optionflow
        ;;
    "help"|"-h"|"--help")
        echo "用法: $0 [命令]"
        echo ""
        echo "命令："
        echo "  deploy    - 完整部署（默认）"
        echo "  start     - 启动应用"
        echo "  stop      - 停止应用"
        echo "  restart   - 重启应用"
        echo "  status    - 查看状态"
        echo "  logs      - 查看日志"
        echo "  help      - 显示帮助"
        ;;
    *)
        error "未知命令: $1"
        echo "使用 '$0 help' 查看帮助"
        exit 1
        ;;
esac