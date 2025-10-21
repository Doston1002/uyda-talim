module.exports = {
    apps: [
      {
        name: 'uyda-talim-front',
        script: 'yarn',
        args: 'start',
        env: {
          NODE_ENV: 'production',
          PORT: 3000,
          NEXT_PUBLIC_API_SERVICE: 'https://api.uydatalim.uzedu.uz'
        }
      }
    ]
  };