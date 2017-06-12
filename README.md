# have-fun-in-node
一些好玩的nodejs脚本。


---

## 糗事百科小爬虫

用到了一些第三方模块，外加对于`events`模块的消息监听的使用。

- `superagent`: 一款网页爬取库，很好用。
- `cheerio`: 一款网页解析库，内置`htmlparser`支持，类似`JQuery`的选择器，对于回调函数写起来确实非常的方便。
- `cli-color`: 一款命令行下的多彩终端助手，支持多种颜色， 多种样式的显示。

![对于糗事百科的小小爬虫实现](https://github.com/guoruibiao/have-fun-in-node/raw/master/qiubai/nodejs-qiubai.gif)

---

## 命令行翻译小工具

借助百度翻译的接口实现的一款命令行版本的翻译小工具。自动处理中英文的判断，并分类输出不同主题的翻译结果。用到的模块有：

- `superagent`: 一款非常好用的网络请求工具库。
- `cli-color`: 提供多样的命令行彩色字符函数，可以轻松构造出优美的命令行输出效果。
- `commander`: 命令行参数解析神器，特别地好用，接口使用起来也很优雅。

![nodejs实现的命令行翻译小工具](https://github.com/guoruibiao/have-fun-in-node/raw/master/translator/translator-in-nodejs.gif)
---
