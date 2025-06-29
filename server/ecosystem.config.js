module.exports = {
    apps: [{
        name: 'pbf-server',
        script: './app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true,
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        merge_logs: true,
        exec_mode: 'fork',
        wait_ready: true,
        listen_timeout: 3000,
        kill_timeout: 5000,
        max_restarts: 5,
        min_uptime: '10s'
    }],

    deploy: {
        production: {
            user: 'ubuntu',
            host: process.env.DEPLOY_HOST || 'localhost',
            ref: 'origin/main',
            repo: 'git@github.com:user/repo.git',
            path: '/home/ubuntu/pbf-server',
            'pre-deploy-local': '',
            'post-deploy': 'pnpm install && pnpm run db:generate && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
}; 