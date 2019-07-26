# git-commit-msg的validate配置

> 好的commit message 可以帮助我们快速定位自己想要寻找的版本，而且统一的规范还有助于传播和分享。

## 安装工具

> 每个工具都会从为什么安装(why)，如何使用(how)两个方面讲

### husky

  > `npm i -D husky`

- why：husky是一个git钩子工具，可以在使用git命令的时候插入我们自己的逻辑。

- how： 在package.json中添加husky字段，可以具体配置hooks下的pre-commit,commit-msg等字段，pre-commit就是commit的钩子，可以在这里执行script命令，如lint检测等。commit-msg字段是配置我们每次提交的规则的，也是本次要使用的。

### validate-commit-msg

  > `npm i -D validate-commit-msg`

- why：上面讲到的husky的commit-msg配置，需要一个具体的msg规范，而这个包就是angular的commit message规范，也是目前受众最多的一个规范。
  
- how： 配置为`husky.hooks['commi-msg']`的值

### commitizen

  > `npm install commitizen -g` 或者 `npm i commitizen -D`

- why：使用commitizen可以为项目添加一个 git cz命令，是一个命令行工具，可以根据提示一步步完成一个符合规范的commit-msg,不熟悉规范的情况下可以使用git cz 命令取代git commit 命令。
  
- how: 全局安装的情况下可以直接执行 `git cz`，非全局安装可以配置一个scripts命令 "commit":"git-cz"。二者效果一致，推荐两个都安装一下，执行git cz 或者 npm run commit 以后根据提示即可往下进行了。
  
### cz-conventional-changelog

  > `npm i cz-conventional-changelog -D`

- why: 每次大版本更新都可以自动输出更改日志
  
- how: 在package.json下添加config 字段，内部配置commitizen,其path字段为"./node_modules/cz-conventional-changelog"
  
## 完整的下载和配置（package.json）

### 下载命令

- `npm i -D husky validate-commit-msg commitizen cz-conventional-changelog`  

- `npm i commitizen -g`

### 配置代码

```js
 "scripts": {
    "commit": "git-cz"
  },
 "devDependencies": {
    "commitizen": "^4.0.3",
    "cz-conventional-changelog": "^3.0.2",
    "husky": "^3.0.1",
    "validate-commit-msg": "^2.14.0"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "husky": {
    "hooks": {
      "commit-msg": "validate-commit-msg"
    }
  }
```
