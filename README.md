### 项目命令

```js
npm run start:dev // 以 dev 环境启动项目
npm run start:test // 以 test环境启动项目

npm run build:test3 // 以 test3 环境构建项目
npm run build:test // 以 test 环境构建项目
npm run build:uat // 以 uat 环境构建项目
npm run build // 以 production 构建项目
```

### 规范

[eslint]: https://git.garena.com/shopee/loan-service/credit_frontend/credit_eslint
[commitlint]: https://github.com/conventional-changelog/commitlint

- 代码规范使用 [@finance/eslint-config-loan][eslint]
  > 注意：@typescript-eslint/eslint-plugin 必须安装 2.27.0 版本以上
- git commit 规范使用 [commitlint][commitlint]，初次不熟悉提交规范的话，可以运行 npm run commit 命令，按照提示一步步进行

### 目录结构

以下只列出比较主要的文件，次要文件不再说明

```js
├── config // 配置文件
│   ├── config.ts // 项目及路由配置文件
│   ├── defaultSettings.ts // layout 配置文件
│   ├── env.ts // 环境配置文件
├── mock // mock 文件目录
├── src
│   ├── assets // 静态资源文件
│   │   ├── imgs // 图片
│   │   ├── less // 样式
│   │   └── logo.svg
│   ├── components // 通用组件
│   │   ├── Authorized // 权限相关
│   │   │   ├── Authorized.tsx // 权限组件
│   │   │   ├── CheckPermissions.tsx // 权限校验逻辑
│   │   │   └── renderAuthorize.ts // 权限存储和刷新
│   │   ├── GlobalHeader // layout 右上角的用户信息组件
│   │   │   ├── AvatarDropdown.tsx
│   │   │   ├── RightContent.tsx
│   │   │   └── index.less
│   │   ├── HeaderDropdown
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── PageLoading // 全局 loading 组件
│   │       └── index.tsx
│   ├── global.less // 全局通用样式
│   ├── layouts // 布局组件
│   │   ├── BasicLayout.tsx // main页面的布局组件
│   │   ├── SecurityLayout.tsx // 用户登陆校验组件，用于拦截能否进入 /login 或者 /main
│   │   ├── UserLayout.less
│   │   └── UserLayout.tsx // 登陆页布局组件
│   ├── locales // 国际化文件
│   ├── models // 状态管理
│   │   ├── connect.d.ts
│   │   ├── global.ts // 全局配置的状态
│   │   ├── setting.ts // layout 配置的状态
│   │   └── user.ts // 用户信息的状态
│   ├── pages // 业务开发页面
│   │   ├── 404.tsx // 没有路由匹配时的页面
│   │   ├── Home // 初始进来的 home 页面
│   │   │   └── index.tsx
│   │   ├── Login // 登陆页
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── document.ejs
│   ├── services // 调用接口的业务 services
│   │   └── user.ts
│   ├── typings.d.ts
│   └── utils // 工具包
│       ├── Authorized.ts // 权限工具包
│       ├── googleAuth.ts // google 授权工具包
│       ├── request.ts // request 封装工具包
│       ├── token.ts // token 管理工具包
│       └── utils.ts // 常用方法工具包
```

### 菜单和路由配置

文件位置：config/config.ts

配置说明：

```js
routes: [
  {
    icon: 'table', // 路由在菜单显示的icon
    name: 'welcome', // 路由在菜单显示的名称，会被国际化，国际化的值对应于 locales/en-US/menu.ts 下的 menu.welcome
    path: '/welcome', // 路由路径
    component: './Welcome', // 路由组件，相对于 src/pages 的相对路径
    routes: [] // 子路由
    hideInMenu: true, // 是否将当前菜单隐藏
    hideChildrenInMenu: true, // 是否隐藏所有子菜单路由
  }
]
```

配置效果：

- 【生成菜单栏】icon 和 name 生成父菜单项，其 routes 的每一项生成子菜单项
- 【生成组件】生成 {path: '/welcome', component: './Welcome'} 的父 Route 组件，其 routes 中的每一项会生成子 Route 组件，作为父 Route 组件的 children

### 权限（todo...）
