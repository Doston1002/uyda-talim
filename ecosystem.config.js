module.exports = {
  apps: [
    {
      name: 'uyda-talim-frontend',
      script: 'yarn',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};