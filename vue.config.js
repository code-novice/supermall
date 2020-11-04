module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@views'
      },
    },
  },
  //关闭或开启ESlink
  lintOnSave: true
}
