const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: true,
    host: 'localhost',
    allowedHosts: 'all',
    port: 8080,
  },
})
