# vue-single-optimize

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# 预打包第三方
npm run dll

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 打包优化：
```
# index.html 使用cdn
<script src="https://cdn.bootcss.com/vue/2.5.13/vue.min.js"></script>
<script src="https://unpkg.com/flyio/dist/fly.min.js"></script>

# dll预打包
生成vendor-manifest.json
<script src="./static/js/vendor.dll.js"></script>

# router异步加载
const HelloWorld = (resolve) => require(['@/components/HelloWorld'], resolve)

# 使用fly替代axios，更小更轻便

# 正式环境建议
productionSourceMap: false, 是否生成.map文件
productionGzip: true, 是否启用压缩功能
productionGzipExtensions: ['js', 'css'], 压缩的文件
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
