### 删除现在的源 origin
- `git remote rm origin`

### 配置不同的仓库
- `git remote add github https://github.com/aaa/blog.git #这里就是git clone的链接`
- `git remote add gitee  https://jeffery0211@gitee.com/jeffery0211/blog.git #gitee这里要把用户名写一遍`

### 查看远程配置
- `git remote -v`

### 上传代码
- `git add .`
- `git commit -m "update"`

### 更新对应仓库
- `git push github master`
- `git push gitee master`

### 同步代码
- `git pull github master`
- `git pull gitee master`