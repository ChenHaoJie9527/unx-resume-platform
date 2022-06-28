## Hooks执行顺序

| Git hooks        | 调用时机          | 备注                            |
| ---------------- | ----------------- | ------------------------------- |
| pre-commit       | git commit 执行前 | 可以使用 git commit --no-verify |
| commit-msg       | git commit 执行前 | 可以使用 git commit --no-verify |
| pre-merge-commit | git commit 执行前 | 可以用 git merge --no-verify    |
| pre-push         | git push 执行前   |                                 |

- pre-commit 触发时，对代码格式进行验证
- commit-msg 触发时，对commit消息和提交用户进行校验
- pre-push 触发时进行单元测试、e2e测试等操作

Git 在执行 git init 时，会在.git/hooks 目录生成一系列的 hooks 脚本：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53a3d639f75a4676802da639a3925c9b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

以 .sample 结尾的文件，表示不会自动执行。我们需要把后缀去掉之后才会生效， 即将 commit-msg.sample 转变成 commit-msg才会起作用。