var webpack = require('atool-build/lib/webpack');

module.exports = function(webpackConfig) {
  // 拷贝html
  module.exports = function(webpackConfig) {
    webpackConfig.module.loaders.push({ test: /\.html$/, loader: 'file?name=[name].[ext]' })
  
    return webpackConfig;
  };
  // 删除common
  webpackConfig.plugins.some(function(plugin, i){
    if(plugin instanceof webpack.optimize.CommonsChunkPlugin || plugin.constructor.name === 'CommonsChunkPlugin') {
      webpackConfig.plugins.splice(i, 1);
      return true;
    }
  });

  // babel 的 plugins 添加 transform-runtime , 为支持Generator函数
  webpackConfig.module.loaders.some(function(loader) {
    var needFixBabelOptionCount = 2;
    if (/babel/.test(loader.loader)) {
      needFixBabelOptionCount --;
      loader.query.plugins.push('transform-runtime');
      if (needFixBabelOptionCount == 0) {
        return true;
      };
    }
  });
  // 返回 webpack 配置对象
  return webpackConfig;
};
