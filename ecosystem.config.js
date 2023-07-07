module.exports = {
  apps: [
    {
      name: 'tally_book',
      script: 'vite-h5-server.js'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '121.199.27.121',
      ref: 'origin/main',
      repo: 'git@github.com:weechou1118/tally-book-fe.git',
      path: '/root/workspace/tally_book',
      'post-deploy': 'git reset --hard && git checkout main && git pull && npm i --production=false && /root/.nvm/versions/node/v16.20.1/bin/pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
