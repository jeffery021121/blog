## 具体操作步骤
1. `git remote -v` 这一步并非必要，查看远程仓库是否只有自己仓库的origin push和fetch。如果有upstream，说明不用再添加upstream，没有则添加
2. `git remote add upstream https://gitee.com/aaaa.git(fork仓库的地址)` 如果没有upstream,添加upstream。
3. `git fetch upstream` 更新本地upstream的代码，类似于自己仓库的 git pull
4. `git merge upstream/master` 将本地代码和本地upstream/master 代码合并
5. `git push origin master` 将合并的代码推向远程仓库 这里的origin是自己仓库的别名，取决于remote add时的定义名称

