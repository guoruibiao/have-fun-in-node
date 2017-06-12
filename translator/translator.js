/**
 * 利用百度翻译接口实现一个小小的翻译软件。
 */
const http = require('http');
const superagent = require('superagent');
const color = require('cli-color');
const commander = require('commander');


/**
 * 将中文文本编码为安全的URI字符串。
 * @param {*中文文本词} text 
 */
function Chinese_encode(text) {
    return encodeURIComponent(text);
}


/**
 * 判断给定的文本是否为中文。
 * @param {*给定的文本内容串} text 
 */
function is_Chinese(text) {
    // [\u4e00-\u9fa5] 是汉语所在的Unicode字符区间。
    return !!text.match(/[\u4e00-\u9fa5]+/gi);
}

/**
 * 处理可能会出现异常信息的内容。
 * @param {*JSON格式的结果串} json 
 */
function handle_chinese_exception(json) {
    var dict;
    try {
        dict = {
            english_means: json['dict_result']['zdict']['simple']['means'][0]['exp'][0]['des'][0]['main'],
            word_means: json['dict_result']['simple_means']['word_means'],
            chinese_means: json['dict_result']['simple_means']['symbols'][0]['parts'][0]['means'][0]['means']
        }
        return dict;
    } catch (err) {
        return dict = {
            english_means: "未找到",
            word_means: "未找到",
            chinese_means: "未找到"
        };
    }
}

/**
 * 处理中文翻译部分的内容。
 * @param {*JSON格式的结果集串} json 
 */
function handle_Chinese_result(json) {
    // 获取字面意思：literal
    var literal = json['trans_result']['data'][0]['result'][0][1];
    // console.log(literal);
    // 处理字典方面含义
    var dict = handle_chinese_exception(json);
    // console.log(dict);
    return result = {
        literal: literal,
        dict: dict
    };

}

/**
 * 处理英文翻译相关可能出现异常的操作。
 */
function handle_english_exception(json) {
    var dict;
    // console.log(json['dict_result']['edict']['item'][0]['tr_group'][0]['tr']);
    try {
        dict = {
            english_means: json['dict_result']['edict']['item'][0]['tr_group'][0]['tr'],
            word_means: json['dict_result']['simple_means']['word_means'],
            tags: json['dict_result']['simple_means']['tags']['core'],
            chinese_means: json['dict_result']['simple_means']['symbols'][0]['parts'][0]['means']
        }
        return dict;
    } catch (error) {
        return dict = {
            english_means: 'not found.',
            word_means: 'not found.',
            tags: 'not found.',
            chinese_means: 'not found.'
        };
    }
}

/**
 * 处理英文翻译相关可能出现操作异常的情况。
 * @param {*JSON格式的结果串} json 
 */
function handle_english_result(json) {
    // 处理字面意义literal
    var literal = json['trans_result']['data'][0]['result'][0][1];
    // console.log(literal);
    // 处理字典相关含义
    var dict = handle_english_exception(json);
    // console.log("****************************\n", dict);
    return result = {
        literal: literal,
        dict: dict
    }
}


/**
 * 翻译给定的文本。
 * @param {*待翻译的文本内容串} text 
 */
function trans(text) {
    var flag = is_Chinese(text);
    var url_interface;
    var result;
    // 处理中文待翻译串
    if (flag) {
        var encoded_text = Chinese_encode(text);
        url_interface = "http://fanyi.baidu.com/v2transapi?from=zh&to=en&query=" + encoded_text;
        // 开始进行网络请求
        superagent.get(url_interface).then((response) => {
            // console.log(response.text);
            var json = JSON.parse(response.text);
            var result = handle_Chinese_result(json);
            // console.log('-------------------\n');
            // console.log(result)
            // 调用终端打印函数，打印相关内容
            print_in_terminal(result, false);

        });
    } else {
        // url_interface = "http://fanyi.baidu.com/v2transapi?query=" + text;
        url_interface = "http://fanyi.baidu.com/v2transapi?from=zh&to=en&query=" + text;
        // 开始处理英文的翻译请求
        superagent.get(url_interface).then((response) => {
            var json = JSON.parse(response.text);
            var result = handle_english_result(json);
            // console.log('============================\n');
            // console.log(result);
            // 调用终端打印函数，打印相关内容
            print_in_terminal(result, true);
        });
    }

}

/**
 * 根据中英文的不同，在命令行打印相关的内容。
 * @param {*待打印内容对象} data 
 * @param {*是否为英文文本} isEnglish 
 */
function print_in_terminal(data, isEnglish) {
    // 英文模式
    if (isEnglish) {
        console.log("字面意：" + color.red.bold(data.literal) + '\n');
        console.log("英文解释：" + color.green.bold(data.dict.english_means) + '\n');
        console.log("中文解释：" + color.green.bold(data.dict.chinese_means) + '\n');
        console.log("考试标签：" + color.blue(data.dict.tags) + '\n');
    } else { // 中文模式
        console.log("字面意：" + color.red.bold(data.literal) + '\n');
        console.log("英文解释：" + color.green.bold(data.dict.english_means) + '\n');
        console.log("词语解释：" + color.blue.bold(data.dict.word_means) + '\n');
        console.log("中文解释：" + color.yellow(data.dict.chinese_means) + '\n');
    }

}

/**
 * 创建命令行参数解析工具，并予以运用。
 */
function create_commander() {
    commander.command('help').description('提示信息： 如何使用这个小工具.').action(() => { commander.outputHelp(); });
    commander.command('trans [text]').description('翻译给定的文本，中英文都可.').action((text) => {
        trans(text);
    });

    // 开始解析命令行参数
    commander.parse(process.argv);
}


/////////////////////////////////////////////测试部分
function main() {
    // var text = "你好";
    // var flag = is_Chinese(text);
    // console.log("是否为中文："+flag);
    // text = "hello";
    // flag = is_Chinese(text);
    // console.log("是否为中文："+flag);

    // trans("软件");
    create_commander();
}
main();
