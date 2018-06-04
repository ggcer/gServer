/* ------------------------------------------对象工具类------------------------------------------ */
const object = {
  //复制一个对象
  copy(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  //若fromObj里面有对应toObj的属性，则把该属性的值赋给toObj
	copyFieldValue(toObj, fromObj) {
		if(fromObj){
			for(let key in toObj){
				if(fromObj[key]){
					toObj[key] = fromObj[key];
				}
			}
		}
  },
  //判断一个对象是否为空对象
	isEmptyObj(obj) {
		for(let name in obj) {
			return false;
		}
		return true;
	},
}

module.exports = object;
