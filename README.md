# 依赖

- [php-ews](https://github.com/Garethp/php-ews)
- php-iconv
- php-soap
- php-ldap

# 环境

## 线上环境

```
外网host
https://meeting-manage-dev.businessconnectchina.com:11443/
内网host
http://meeting-manage-dev.businessconnectchina.com

```

### 安装部署

注意服务器需要支持语言：

```
yum install glibc-langpack-zh
yum install glibc-langpack-ko
```

启动定时任务

```
nohup php /www/wwwroot/172.16.89.91/web/task/sync_tpcs.php > /dev/null 2>&1 &
```

### 管理后台

```
外网：https://meeting-manage-dev.businessconnectchina.com:11443/admin/index.html
内网：http://172.16.89.91/web/admin/index.html
username: admin
password: H2cLXTuwxevD7Gr
```

### 服务器

```
172.16.89.91
username: bccadmin
password: yLpi2jWsQEy8Rzi3
```

### 宝塔管理地址

```
https://172.16.89.91:13439/127190c5
username: olmjtsio
password: 1K3bcsoGs
password(old): 8f1d9ed6**
```

### 数据库

root（仅服务器本地可用）

```
root
c3c3e23e155bc9a0
```

远程管理

```
msrb_remote
VHfoasdhnw9o7D
```

项目所用账号（仅服务器本地可用）

```
msrb
B4PJSdmWseKH6m6L
```

### 会议室管理邮箱

邮箱服务器地址：mail2013.businessconnectchina.com

| 房间 | 邮箱                   | 密码          |
|----|----------------------|-------------|
| A  | Room.A@bcc.global    | Ycu9cZe@Lt  |
| B  | Room.B@bcc.global    | $EmcHaL5bE  |
| C  | Room.C@bcc.global    | 4qMts$tjL%  |
| D  | Room.D@bcc.global    | @3HPCUwiLi  |
| 测试 | Room.Test@bcc.global | %kRY$7h^&H  |
| /  | Room.Test2           | 	$2LG@V5RrK |
| /  | Room.Test3	          | n^nqZH40H%  |
| /  | Room.Test4           | 	^5WpwOPlvZ |
| /  | Room.Dev1            | 	AY$$Eabrb4 |
| /  | Room.Dev2            | 	PSH7il#Gw5 |
| /  | Room.Dev3	           | JI%oSlfOS9  |

### LDAP

```
# 地址
172.16.88.180:389
# DN
CN=meet.ldap,OU=LDAP,DC=businessconnectchina,DC=com
# 密码
9CiJT@K8%3
```

### 企业微信

```
CopId:ww09d67060e82cbfa5
AgentId:1000034
Secret:FrUSBdm1fn8aI96JQVAwMPoEZyV8-VrXfOREwvbvRkM
# APP页面
https://meeting-manage-dev.businessconnectchina.com:11443/app/index.html
```

## 测试环境

```
内网host
http://172.16.89.161:82
```

### 管理后台

```
外网：https://meeting-manage-test.businessconnectchina.com:12443/admin/index.html
内网：http://172.16.89.161:82/admin/index.html
username: admin
password: H2cLXTuwxevD7Gr
```

### 宝塔登录

外网面板地址: https://140.207.173.170:15351/062b1000

内网面板地址: https://172.16.89.161:15351/062b1000

```
username: ponzpttl
password: 77028cc0
ssh: bccadmin/bcc@123456
```

### 企业微信

```
CopId:ww09d67060e82cbfa5
AgentId:1000032
Secret:4kQjzoLSa1uBR5Ow5UWItaiI7CCSzjFYqzYTgKuR4IA
# APP页面
https://meeting-manage-test.businessconnectchina.com:12443/app/index.html
```

### FTP

```
mrbs_ftp
GNxPtrzkt6GPpZjB
```

## 本地环境

### 管理后台

 ```
http://localhost:81/web/index.php
username: admin
password: H2cLXTuwxevD7Gr
 ```
