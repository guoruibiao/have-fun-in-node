/**
 * 实现类似于Python原生支持的字符串格式化操作。
 * 1：全`{}`形式的话，按照先后顺序匹配变量名参数列表；
 * 2：包含`{xx.yy.zz}`格式，则此类型的会按照`对象访问`模式进行变量值替换；
 */
module.exports.format = function (str, params = []) {
    var pattern = /{([\s\S])*?}/gim;
    var index = 0;
    var params_index = 0;
    return str.replace(pattern, (match, tuple, offset) => {
        index = offset + match.length;
        params_index += 1;

        // 异常格式处理，对于列表和对象类型的param，对外抛出异常
        if(typeof params[params_index-1]==[] || typeof params[params_index-1]=={}) {
            throw TypeError(params[params_index-1]+"不能为对象类型！");
        }

        if (match.length > 2 ) {
            match = match.slice(1, match.length - 1);
            return eval('params[params_index-1].' + match);;
        } else {
            return params[params_index-1];
        }
    });
}
