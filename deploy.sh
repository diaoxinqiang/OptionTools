#!/bin/bash

# OptionFlow PM2 部署脚本
# 用途：自动化构建和部署 React + Vite 应用

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目配置
APP_NAME="optionflow"
PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
LOG_DIR="$PROJECT_DIR/logs"

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 PM2 是否安装
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 未安装，正在安装..."
        npm install -g pm2
        print_info "PM2 安装完成"
    else
        print_info "PM2 已安装: $(pm2 -v)"
    fi
}

# 检查 Node.js 和 npm
check_dependencies() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    print_info "Node.js 版本: $(node -v)"
    print_info "npm 版本: $(npm -v)"
}

# 创建日志目录
create_log_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        print_info "创建日志目录: $LOG_DIR"
    fi
}

# 安装依赖
install_dependencies() {
    print_info "安装项目依赖..."
    npm install
    print_info "依赖安装完成"
}

# 构建项目
build_project() {
    print_info "开始构建项目..."
    npm run build
    
    if [ -d "$PROJECT_DIR/dist" ]; then
        print_info "构建成功，输出目录: $PROJECT_DIR/dist"
    else
        print_error "构建失败，dist 目录不存在"
        exit 1
    fi
}

# 启动应用
start_app() {
    print_info "启动应用..."
    cd "$PROJECT_DIR"
    pm2 start ecosystem.config.cjs
    pm2 save
    print_info "应用启动成功"
}

# 重启应用
restart_app() {
    print_info "重启应用..."
    pm2 restart $APP_NAME
    print_info "应用重启成功"
}

# 停止应用
stop_app() {
    print_info "停止应用..."
    pm2 stop $APP_NAME
    print_info "应用已停止"
}

# 删除应用
delete_app() {
    print_info "删除应用..."
    pm2 delete $APP_NAME
    print_info "应用已删除"
}

# 查看状态
show_status() {
    pm2 status
    echo ""
    pm2 info $APP_NAME
}

# 查看日志
show_logs() {
    pm2 logs $APP_NAME --lines 50
}

# 完整部署流程
full_deploy() {
    print_info "========================================="
    print_info "开始完整部署流程"
    print_info "========================================="
    
    check_dependencies
    check_pm2
    create_log_dir
    install_dependencies
    build_project
    
    # 检查应用是否已经在运行
    if pm2 list | grep -q $APP_NAME; then
        print_warn "应用已存在，执行重启..."
        restart_app
    else
        print_info "首次部署，启动应用..."
        start_app
    fi
    
    print_info "========================================="
    print_info "部署完成！"
    print_info "========================================="
    show_status
}

# 快速重新部署（不重新安装依赖）
quick_deploy() {
    print_info "快速重新部署..."
    build_project
    restart_app
    show_status
}

# 显示帮助信息
show_help() {
    echo "OptionFlow PM2 部署脚本"
    echo ""
    echo "用法: ./deploy.sh [命令]"
    echo ""
    echo "命令:"
    echo "  deploy        完整部署（安装依赖、构建、启动/重启）"
    echo "  quick         快速部署（仅构建和重启）"
    echo "  start         启动应用"
    echo "  restart       重启应用"
    echo "  stop          停止应用"
    echo "  delete        删除应用"
    echo "  status        查看应用状态"
    echo "  logs          查看应用日志"
    echo "  help          显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh deploy    # 首次部署或完整部署"
    echo "  ./deploy.sh quick     # 快速更新代码后重新部署"
    echo "  ./deploy.sh logs      # 查看实时日志"
}

# 主函数
main() {
    case "${1:-deploy}" in
        deploy)
            full_deploy
            ;;
        quick)
            quick_deploy
            ;;
        start)
            check_pm2
            start_app
            ;;
        restart)
            check_pm2
            restart_app
            ;;
        stop)
            check_pm2
            stop_app
            ;;
        delete)
            check_pm2
            delete_app
            ;;
        status)
            check_pm2
            show_status
            ;;
        logs)
            check_pm2
            show_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
