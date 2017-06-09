# nextjs-cookie-example

让next.js服务端渲染中的接口调用支持cookie的设置，附带http2支持

add support for cookie pass through in fetching while server side rendering in next.js

## 为什么要做这个项目 Why?

安全，当所有的逻辑客户端都可以看到（即使你混淆了代码），服务端客户端一套代码让我们更容易维护逻辑，同时，作弊也变得更容易。你的关键逻辑必须和身份验证紧密合作，才能保证数据安全。

## 以下情况不需要使用此项目

- 无需身份验证的项目

- 基于firebase的项目或类似， firebase本身有验证系统和服务端权限逻辑，其数据和验证本身是紧密合作的

- 数据服务接口无法定制的项目， 本项目需要在需要设置cookie的时候同时设置返回头中 `custom-set-cookie` 和 `Set-Cookie` 一致，因为fetch接口为了保证浏览器的设置cookie行为而无法获取`Set-Cookie`这个字段。 当然也可以用返回字段的方式实现，这些多少都需要一点对服务端的定制

## 迁出代码、安装依赖、启动服务 git\install\start

```
git checkout https://github.com/postor/nextjs-cookie-example.git
cd nextjs-cookie-example
npm install
node server.js
```

## 验证cookie透传

- 【设置cookie】浏览器打开 http://localhost/about 打开控制台（F12），运行 `document.cookie` 可以看到 `date=xxx`，刷新页面重新运行 `document.cookie` 可以得到最新的日期

- 【透传cookie】http://localhost/login 输入账号`test`，密码`123456`，点击提交，回到about页面，刷新页面（服务端渲染）可以看到仍是登录状态（注意显示json中 `props.about.user` 是来自数据接口）

## 透传cookie实现方式（修改定制）

前面提到过因为fetch接口为了保证浏览器的设置cookie行为而无法获取`Set-Cookie`这个字段，所以我们需要另一个字段来辅助，我这里使用的是`custom-set-cookie`

server.js line 38

```
    res.cookie('date',new Date())
    res.header('custom-set-cookie',res.getHeader('set-cookie'))
```

components/fetch.js line 13

```
    var setCookie = req?r.headers._headers['custom-set-cookie']:r.headers.get('custom-set-cookie')
    if(req && res){
      //server side 
      res.header('set-cookie', setCookie)
    }else{
      //client side
      document.cookie = setCookie
    }
```

## 生成证书自己的证书

用于http2，注意数据接口目前使用的是http，要使用http2的话同时需要https的接口，而只有认证的证书才可以，自签名的证书是不行的

```
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```