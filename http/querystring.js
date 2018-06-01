/**
 * 将querystring字符串转 object
 * @param {*} str 
 */
export function parse(str){
    let data= {}
    str.replace(/^[\s#\?&]+/, "").replace(/&+/, "&").split(/&/).forEach(function(item){
        let arr = item.split(/=+/)
        let key = arr[0];
        if(key){
            let val = decodeURIComponent(arr[1] || "");
            if (data[key] === undefined) {
                data[key] = val;
            }
            else if (data[key].push) {
                data[key].push(val);
            }
            else {
                data[key] = [data[key], val];
            }
        }
    })
    return data;
}

let searchStr = window && window.location && window.location.search || '';
let itemData = {};

/**
 * 获取参数
 * @param {String} key 
 * @param {String} str = location.search
 */
export function getItem(key, str = searchStr){
    if(!itemData[str]){
        itemData[str] = parse(str);
    }
    return key === undefined ? itemData[str] : itemData[str][key];
}

/**
 * 将数据转换为 querystring 字符串
 * @param {*} json 
 */
export function stringify(json){
    let arr = []
    for(let n in json){
        if(json.hasOwnProperty(n)){
            let item = json[n]
            let key = encodeURIComponent(n)
            if( item.constructor == Array ){
                for (let i = 0; i < item.length; i += 1) {
                    arr.push(key + "=" + encodeURIComponent(item[i]));
                }
            }
            else{
                arr.push(key + "=" + encodeURIComponent(item));
            }
        }
    }
    return arr.join('&')
}