/**
 * 使用几个比较不错的第三方模块实现糗事百科网站的小爬虫。
 */
const superagent = require('superagent');
const cheerio = require('cheerio');
const color = require('cli-color');
const http = require('http');
const events = require('events');

/**
 * 定义一个网页总数变量。
 */
const MAX_PAGE_SIZE = 3;

// var website = 'https://www.qiushibaike.com/8hr/page/2/';
// var website = "http://blog.csdn.net/marksinoberg";
// var website = 'https://www.qiushibaike.com/article/119148411';
var total_results = [];
var emitter = new events.EventEmitter();

function crawl_by_page(page, website) {
    var results = []
    superagent.get(website).then((response) => {
        // 获取到网页内容，交给cheerion进行解析即可。
        var $ = cheerio.load(response.text);
        // fs.writeFileSync('text.txt', response.text);

        $("div .untagged").each(function (index, element) {
            console.log("正在处理第：" + (page)+"页第"+(index+1)+" 条数据！");
            var authorage = $(this).find('div[class="author clearfix"]').text();
            var author = '', age = '';
            author = authorage.trim().split("\n")[0];
            age = authorage.match(/\d+/g);
            // console.log("作者：" + author + "\n年龄:" + age + "\n");
            // console.log('---------------------\n笑话内容：\n');
            var temp = $(this).find('div[class="content"]').text().trim();
            // console.log(temp);
            var obj = {
                author: author,
                age: age,
                content: temp
            }

            read_duanzi(obj);

            if (obj)
                results.push(obj);
        });
    }).then(function () {
        console.log('done.');
        // 设置一个最终响应事件
        var counts = (parseInt(page) * 20);
        emitter.emit('pageover', results);
        if (page == MAX_PAGE_SIZE) {
            emitter.emit('done', counts);
        }
    });

}


function read_duanzi(item){
    console.log(color.red('作者：'+item.author));
    console.log(color.green('年龄：' + item.age));
    console.log(color.blue('段子内容：\n')+item.content);
    console.log(color.green.bold("----------------------------------------------\
    ------------------------------------------------------------------------------------------"));
}


function main() {
    for (var page = 1; page <= MAX_PAGE_SIZE; page++) {
        var website = 'https://www.qiushibaike.com/8hr/page/' + page + '/';
        crawl_by_page(page, website);
    }
}




/**
 * 入口函数。
 */
main();

/**
* 事件监听，对指定消息进行响应。 
*/
emitter.on('pageover', function (results) {
    total_results.concat(results);
    console.log(color.yellow("page downloading over."));

});
emitter.on('done', (counts) => {
    console.log(color.green("共下载了：" + counts + "个段子！"));
});

