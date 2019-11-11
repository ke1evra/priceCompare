const fs = require('fs');
var exports = module.exports = {};

exports.replaceSpetialSHars = (text) => {
    String.prototype.replaceAll = function(search, replace) {
        return this.split(search).join(replace);
    };

    return text
    // .replaceAll("%", "%25")   // Процент
        .replaceAll(" ", "")   // Пробел
        .replaceAll("\t", " ") // Табуляция (заменяем на пробел)
        .replaceAll("\n", " ") // Переход строки (заменяем на пробел)
        .replaceAll("\r", " ") // Возврат каретки (заменяем на пробел)
        .replaceAll("\"", "&qout;") // Двойная кавычка
        .replaceAll("\'\'", "&qout;") // Двойная кавычка
        .replaceAll("\\", "") // Двойная кавычка
        .replaceAll('"', "&quot;") // Двойная кавычка
};

exports.genWordEnd = (n, w, e1, e2, e3, o) => {
    let r = '';
    let s = n + '';
    let i = s.length - 1;
    s = +s[i];
    if (s > 4 || s == 0) {
        r = w + e1;
    } else if (n > 10 && n < 20) {
        r = w + e1;
    } else if (s == 1) {
        r = w + e3;
    } else {
        r = w + e2;
    }
    if (o) {
        if (o == 1) {
            // console.log(n +  ' '+typeof(n));
            r = n + ' ' + r;
        }
    }

    return (r);
}

exports.NmbrFt = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

exports.rfSync = (path) => {
    r = JSON.parse(fs.readFileSync(path, "utf8"));
    return r;
}

exports.wfSync = (data, path) => {
    try {
        let json = JSON.stringify(data, null, 4);
        fs.writeFileSync(path, json, 'utf8');
    } catch (e) {
        console.log(e);
    } finally {

    }

}

exports.translite = (inputstr) => {
    var space = '-';
    let result = ''
    var transl = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
        'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    let str = inputstr.toLowerCase();
    str = str.replace(/[.]/g, '');
    for (var i = 0; i < str.length; i++){
        if (/[а-яё]/.test(str.charAt(i))){ // заменяем символы на русском
            result += transl[str.charAt(i)];
        } else if (/[a-z0-9]/.test(str.charAt(i))){ // символы на анг. оставляем как есть
            result += str.charAt(i);
        } else {
            if (result.slice(-1) !== space) result += space; // прочие символы заменяем на space
        }
    }
    return result;
}