## map

>保存键值对，构造函数接收一个数组作为参数eg:`new Map([[a,1],[b,2]])`ps：可以想象成Object.entries(obj)

### map和对象的区别

- map可以用任意值为键和值，对象的键只能是字符串或者symbol
- map中的键值对是有顺序的（FIFO，先入先出），对象没有
- map的键值对可以从size属性获取，对象只能自己计算。
- 对象有有原型和原型链

### map的属性

- size 返回map的长度

### map的方法

- `set(key,value)` 设置map中设置元素，有则更改，无则添加。返回map本身，可以链式调用
- `get(key)` 获取map中的元素
- `has(key)` 判断map中是否对应键值对，返回布尔值
- `delete(key)` 删除对应数据
- `clear()` 清空map

### 遍历方法

- `keys()`  返回键名遍历器
- `values()` 返回键值遍历器
- `entries()` 返回键值数组遍历器 **注意上面三种都是返回遍历器，还需要`for...of`循环去执行遍历**
- `forEach((value,key,this)=>{})` 和数组的forEach方式类似,只不过第二个参数是key
- 直接用`for...of`遍历map,相当于遍历`map.entries()`

### map与对象和数组的转换

- 和数组互相转换
  ```js
  let map = new Map([['a',1],['b',2]])// 数组转map
  let arr = [...map] /// map转数组
  ```
- 和对象抓换（遍历赋值）
  ```js
  let obj = {}
  for(let [key,value] of map){
    obj[key] = value
  }
  ```
### weakMap（weak弱引用，不可遍历，相关对象消失即销毁）

- weakMap 没有遍历方法，只有`get`,`set`,`has`,`delete`
- 它的键只能是对象，并且不能为null
- 不能遍历，也没有clear方法，不能清空
- 最大的用途是和一个未来可能会消失的对象绑定，一但对象被回收，那它度对应的价值对也会回收，有助于防止内存泄漏

## set

>如果是map是对象的映射，那set就是数组的映射，只是set内部要求数据不能重复

### set和数组的区别

- set中的数据不能重复
- set中认为 NaN和NaN相等，所以一个set中不会有两个NaN
- Set构造函数接收带遍历器的数据，如数组
- Array的参数会塞到数组中

### set的属性

- `size` 返回set长度

### set的方法

> 没有get方法，取值很麻烦，得遍历
- `add(value)` 添加数据，可链式调用，返回set本身
- `delete(value)` 删除数据，返回删除是否成功，布尔值，set删除元素比数组简单太多
- `has(value)` set中是否有该值，返回布尔值
- `clear()` 清空set

### 遍历方法

> 遍历时，set可以看成是键值相同的map
- `keys()` 返回键名遍历器
- `values()` 返回键值遍历器
- `entries()` 返回[key,value]数组遍历器 **注意上面三种都是返回遍历器，还需要`for...of`循环去执行遍历**
- `forEach((value,key,this)=>{})` 和数组的forEach方式类似,只不过第二个参数是key和value相同


### set主要应用

- 去重 `arr = [...new Set(arr)]`

### weakSet（weak弱引用，不可遍历，相关对象消失即销毁）

- weakSet 没有遍历方法，只有`add`,`has`,`delete`
- 它的成员只能是对象，不能为null
- 不能遍历，也没有clear方法，不能清空
- 最大的用途是存储一个未来可能消失的对象，一但对象被回收，那它度对应的weakSet存储数据也会消失，有助于防止内存泄漏
