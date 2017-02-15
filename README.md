# WESharp 2017 春季招新宣传页

## 安装及运行

```shell
# 安装依赖
npm install
# or
yarn install

# 运行本地测试服务器
npm run dev

# 进行生产建构，默认输出至 ./dist
npm run build
```

## 更新纪录

### 1.7.0 - 2017-02-15

### Feature

- 增加加载提示
- 提交表单使用 ajax 完成
- 对于高宽比低于一定程度的屏幕做轻度适配
- 对桌面端（width > 1024px）做简单适配
- 增加更完善的表单验证并与后台逻辑同步

### Fix

- 修复 WEBike 和时光慢递预览的顺序问题

### Refactor

- 分割 pcss 至不同文件
- 对加载动画做内联化处理
- 对 lib-flexible 做内联化处理

### 1.2.0 - 2017-02-14

#### Chore

- 增加 gulp 工作流

### 1.1.1 - 2017-02-14

#### Feature

- 增加客户端表单验证

#### Fix

- 修复表单无滚动条的问题

### 1.0.0 - 2017-02-13

#### Feature

- 完成全部样式和动画

#### Fix

- 删除最后一页多余的 overflow: hidden

#### Chore

- 增加生产构建脚本

### 0.2.8 - 2017-02-13

#### Feature

- 增加 1,2 页的结构和样式
- 完成 swiper 背景的渐变效果（须多余页配合）

#### Chore

- 搭建 webpack + browser-sync 的开发环境
- 完成 swiper 的配置
