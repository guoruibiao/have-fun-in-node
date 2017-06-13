# str-format

---

## how to install

- one way:
```
npm install str-format
```

- the other way:

Download the source firstly, and then use it as local module is all right.

Such as:

```
var str_format = require('./str-format/index');
```

---

## test case

```
const stringutils = require('./stringutils');


var str = "Hello {}!Welcome to {address}!\nAre you come from {} or {china.beijing}.";
var params = ['游客', {address: "冰雹工作室"}, '朝阳区', {china: {beijing: '北京'}}];
var result = stringutils.format(str, params);
console.log(result);
```

save this script as `test-str-format.js`, and the run it with `node test-str-format`. You will get the result like this:

```
Hello 游客!Welcome to 冰雹工作室!
Are you come from 朝阳区 or 北京.
```