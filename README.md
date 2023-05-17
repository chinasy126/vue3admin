
## 项目启动

1. 安装依赖

    ```bash
    npm install
    ```

2. 启动运行

    ```bash
    npm run dev
    ```

3. 开发模式配置.env.development

    ```
    ===== JAVA版本配置 =====
    设置对应地址:端口JAVA访问的接口
    VITE_APP_TARGET='http://localhost:8088'
    图片访问的地址
    VITE_APP_UPLOAD_URL = 'http://localhost:8088/public'
    
    ===== PHP版本配置 =====
    设置对应地址:端口php访问的接口
    VITE_APP_TARGET= 'http://localhost:80/index.php'
    图片访问的地址
    VITE_APP_UPLOAD_URL = 'http://localhost:80/public'
    ```

4. 访问测试

   浏览器访问： [http://localhost:3000](http://localhost:3000)

   访问用户名：admin

   访问密码：admin

## 项目部署

- 本地打包

  ```
  npm run build:prod
  ```

  生成的静态文件位于项目根目录 `dist` 文件夹下
