module.exports = {
  apps: [{
    name: 'optionflow',
    script: 'npm',
    args: 'run preview -- --port 3000 --host 0.0.0.0',
     cwd: new URL('.', import.meta.url).pathname, // 动态目录
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    min_uptime: '10s',
    max_restarts: 5,
    kill_timeout: 5000,
    listen_timeout: 3000,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};