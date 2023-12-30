<<<<<<< HEAD
<p align="center">
    <img src="https://img.shields.io/badge/Vue-3.2.40-brightgreen.svg"/>
    <img src="https://img.shields.io/badge/Vite-4.0.0-green.svg"/>
    <img src="https://img.shields.io/badge/Element Plus-2.2.27-blue.svg"/>
    <a href="https://gitee.com/youlaitech/youlai-mall" target="_blank">
        <img src="https://gitee.com/youlaiorg/vue3-element-admin/badge/star.svg"/>
    </a> 
    <img src="https://img.shields.io/badge/license-MIT-green.svg"/>
    <a href="https://gitee.com/youlaiorg" target="_blank">
        <img src="https://img.shields.io/badge/Author-有来开源组织-orange.svg"/>
    </a>
</p>
<p align="center">
<a target="_blank" href="http://vue3.youlai.tech">在线预览</a> |  <a target="_blank" href="https://www.youlai.tech/pages/5d571c/">官方文档</a> 
</p>

## 项目介绍

[vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) 是基于 [vue-element-admin](https://gitee.com/panjiachen/vue-element-admin) 升级的 Vue3 版本后台管理前端解决方案；使用前端主流技术栈 Vue3 + Vite3 + TypeScript + Vue Router + Pinia + Volar + Element Plus 等；实现功能包括不限于动态权限路由、按钮权限控制、国际化、主题大小切换等；基于此模板开发了有来商城管理系统，也是有来开源组织的又一项开源力作。

## 项目优势

- 基于 vue-element-admin 升级的 Vue3 版本 ，极易上手，减少学习成本；
- 一套完整适配的微服务权限系统线上接口，企业级真实前后端接入场景，非 Mock 数据；
- 功能全面：国际化、动态路由、按钮权限、主题大小切换、Echart、wangEditor；
- TypeScript 全面支持，包括组件和 API 调用层面；
- 主流 Vue3 生态和前端技术栈，常用组件极简封装；
- 从 0 到 1 的项目文档支持 ([文档地址](https://www.cnblogs.com/haoxianrui/p/16090029.html))；

## 技术栈

| 技术栈 | 描述 | 官网 |
| --- | --- | --- |
| Vue3 | 渐进式 JavaScript 框架 | https://v3.cn.vuejs.org/ |
| TypeScript | JavaScript 的一个超集 | https://www.tslang.cn/ |
| Vite | 前端开发与构建工具 | https://cn.vitejs.dev/ |
| Element Plus | 基于 Vue 3，面向设计师和开发者的组件库 | https://element-plus.gitee.io/zh-CN/ |
| Pinia | 新一代状态管理工具 | https://pinia.vuejs.org/ |
| Vue Router | Vue.js 的官方路由 | https://router.vuejs.org/zh/ |

## 项目预览

在线预览: [vue3.youlai.tech](http://vue3.youlai.tech)

| ![控制台](https://s2.loli.net/2022/12/09/34iklzLAnsIuXDh.png) | ![国际化](https://s2.loli.net/2022/04/07/lt6u2jMefpTJvkh.gif) |
| --- | --- |
| ![用户管理](https://s2.loli.net/2022/12/09/gjJibCaVP3Ysnoh.png) | ![角色管理](https://s2.loli.net/2022/12/09/xHoNctJj2hUfMO8.png) |
| ![菜单管理](https://s2.loli.net/2022/12/09/dah34MRfqiB2cez.png) |![富文本编辑器](https://s2.loli.net/2022/12/09/QzCDIwmqydtLPYr.png) |

## 项目地址

|  | Gitee | Github |
| --- | --- | --- |
| vue3-element-admin | [vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) | [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin) |
| 后端工程(非必要) | [youlai_boot](https://gitee.com/youlaiorg/youlai-boot) | - |

## 环境要求

- Node 环境 

  版本：16+

- 开发工具

  VSCode

- 必装插件

  - Vue Language Features (Volar) 
  - TypeScript Vue Plugin (Volar)
=======
# vueAdmin

> 这是一个极简的 vue admin 管理后台。

## 特色功能

1. 新建相关组件可自动创建路由
2. 封装公用查询，表格，翻页组件。
3. 集成添加修改组件，传递接口，以及相关数据。
4. 封装弹窗功能，传递接口，以及相关条件。
5. 接口与mockjs共存，无后端情况可调用mockjs.
6. 权限菜单按钮级别 v-permission="['自定义字段']"，树形结构显示。
7. 前端路由一件同步数据库菜单，开发模式下，开发阶段展示所有菜单，线上功能路由与后端权限匹配显示。
9. 后端springboot mybatisplus Mysql
10. 后端兼容 php+mysql
11. 开发阶段配置.env.development文件配置连接后端地址。
12. 打包部署配置NGINX
13. 实现拖拽排序功能
14. 导入，导出文件
>>>>>>> e3f1fb2998023388a14dc12e3775bd6a4c26193c

## 项目启动

1. 安装依赖

    ```bash
    npm install
    ```
<<<<<<< HEAD
=======

>>>>>>> e3f1fb2998023388a14dc12e3775bd6a4c26193c
2. 启动运行

    ```bash
    npm run dev
    ```
<<<<<<< HEAD
3. 访问测试

   浏览器访问： [http://localhost:3000](http://localhost:3000)

## 项目部署

- 本地打包

  ```
  npm run build:prod
  ```

  生成的静态文件位于项目根目录 `dist` 文件夹下

- 上传文件

  创建 `/mnt/nginx/html` 目录，将打包生成 `dist` 下的所有文件拷贝至此工作目录下

- nginx.cofig 配置

  ```
  server {
      listen     80;
      server_name  localhost;

      location / {
          root /mnt/nginx/html;
          index index.html index.htm;
      }

      # 代理转发请求至网关，prod-api标识解决跨域,vapi.youlai.tech 线上接口地址，注意后面/
      location /prod-api/ {
          proxy_pass http://vapi.youlai.tech/;
      }
  }

  ```
## 本地接口

> 默认使用线上接口，如果你了解一点Java后端SpringBoot，可轻松搭建本地接口环境：

1. 访问后端项目仓库地址：https://gitee.com/youlaiorg/youlai-boot.git

2. 根据项目说明文档 [README.md](https://gitee.com/youlaiorg/youlai-boot#%E9%A1%B9%E7%9B%AE%E8%BF%90%E8%A1%8C) 完成数据库的创建和后端工程的启动；
3. 进入 [vite.config.ts](vite.config.ts) 文件修改代理线上接口地址 http://vapi.youlai.tech 为本地接口地址 http://localhost:8989 即可。


## 联系信息

> 欢迎添加开发者微信，备注「有来」进群，备注「无回」参与开发

| ![郝先瑞](https://s2.loli.net/2022/04/06/yRx8uzj4emA5QVr.jpg) | ![张川](https://s2.loli.net/2022/04/06/cQihGv9uPsTjXk1.jpg) |
| --- | --- |
=======



## 发布
生成的静态文件位于项目根目录 `dist` 文件夹下

```bash
# 构建测试环境
npm run build
```

## 访问

```bash
# 访问地址
http://localhost:3000
```
```bash
# 访问用户名
admin
```
```bash
# 访问密码
admin
```

## 接口配置

```bash
# 修改文件
.env.development
```


# 接口访问
访问端口根据实际调整

java接口访问
```bash
# 图片转换后的真实地址  java转换地址
VUE_APP_UPLOAD_URL = 'http://localhost:8088/public'
# 需要映射到的后台接口地址
VUE_APP_BASE_URL = 'http://localhost:8088'
```
php接口访问
```bash
# 图片转换后的真实地址  php转换地址
 VUE_APP_UPLOAD_URL = 'http://localhost:80/public'
# 需要映射到的后台接口地址
 VUE_APP_BASE_URL = 'http://localhost:80/index.php'
```

>>>>>>> e3f1fb2998023388a14dc12e3775bd6a4c26193c
