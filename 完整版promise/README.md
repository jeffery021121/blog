# 手写promise

> promise手写记录总结，只是记录了一些自己认为比较核心的知识点。方便以后快速复习。then中返回的promise只是珠子，resolve和reject才是执行的线。

## 详细知识点记录
- a+规范地址 https://promisesaplus.com/
- 核心知识点
    - promise能够链式调用，原因是then方法返回了一个新的promsie.
    - 当前promise的resolve或者reject方法是执行then中回调的钥匙
    - resolvePromise方法的参数中有下一个promise的resolve和reject,并且会触发其中一个，让promise链执行下去。
    - 除了第一个promise的resolve或者reject是在excutor中触发，其他的都是promise内部帮忙触发（resolvePromise中触发）
    - 一句话总结，当前promise的resolve或reject执行就会让promise链执行下去。

- promise 是一个类，构造的时候接收一个`excutor`参数，该参数是一个函数
- promise 给这个函数传递 `resolve`和`reject`两个实参
- promise 有一个状态，状态改变是不可逆的，只能从`PENDDING`到`FULLFILLED`或者`REJECTED`
- promise有两个属性`value`,`reason`分别是then两个函数参数`onFullFilled`和`onRejected`的参数
- resolve方法 将状态从`PENDDING`改为`FULLFILLED`，赋值value
- reject方法  将状态从`PENDDING`改为`REJECTED`赋值reason
- resolve不是类上的方法，只是构造器中的两个方法
- then方法属于promise,可以链式调用，then方法接收两个函数参数 `onFullFilled` 和 `onRejected`. 状态为FULLFILLED时执行前者，REJECTED时执行后者
- then方法的两个函数参数返回的值将作为下一个then方法参数函数的 value和reason
- 并且then方法上注册的两个回调函数，是在微任务中执行的，意味着自己实现的时候，这俩方法的执行要放在`setTimeOut(fn，0)`的fn里执行。
- 任何逻辑的执行都应该包裹try...catch并且catch的数据直接执行onRejected方法。
- 如果onRejected方法返回了正常的数据，promise链仍然能执行下去。下一个onFullFilled函数可以接受本次的reason做value.
- 解析then函数参数返回的数据可以提取一个resolvePromise方法，因为可能会写多遍
- 如果then方法执行的时候，promise状态为PENDDING,就把解析方法存到当前prmise的对应回调数组上
- promise有两个回调数组属性，onFunllFilledCallbacks和onRejectedCallbacks,分别存放对onFullfilled 和 onRejected解析的解析函数。
- resolve执行的时候，也要将对应回调数组中的回调函数执行一遍
- 解析函数resolvePromise。参数有then返回promise(promise2)的resolve,reject,promise2和对应函数参数的返回值x
  - 该函数有一个called或者变量，保证解析只能执行一次，主要是针对thenable对象的 
  - 第一步，判断x是否和promise2想等，如果相等，直接报错。变成了自己等待自己完成，矛盾了。
  - 判断是否为thenAble 对象，如果是，执行其then，onFullFilled函数自定义，内容为修改called,用resolvePromise去解析onFullFilled的参数。
  - 如果不是thenAble对象，resolve(x)即可，任何报错用reject处理。
- 特殊情况，resolve的是一个thenAble对象，那么直接用上面处理thenAble的逻辑处理一遍。
- 测试
    - 全局安装 promises-aplus-tests
    - promises-aplus-tests 当前文件名
    - 可以根据提示修改不规范的地方
- 额外的方法（都可以先把数组项包装成promise，使用promise.resolve）
    - all 用一个数组记录所有的promise,执行成功以后把结果放到这个数组中，知道这个结果数组的长度和对应的参数数组长度一致，resolve结果数组。
    - race 利用resolve只能触发一次的特性所有promise共用一个resolve即可
  

## 代码贴图以及发分析
```js

const STATUS = {
  PENDDING: 'PENDDING',
  FULLFILLED: 'FULLFILLED',
  REJECTED: 'REJECTED',
}

const resolvePromise = (x, promise2, resolve, reject) => {
  let called = false // 该promise是否被解析过，主要针对thenable对象
  if (x === promise2) {
    reject(new TypeError(`TypeError: Chaining cycle detected for promise #<Promise>`))
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = x.then
      if (typeof then === 'function') {
        // 默认是一个promise
        // x.then(resolve, reject) //这里可能还会有promise，得深度解析
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(y, promise2, resolve, reject)
          },
          reason => {
            if (called) return
            called = true
            reject(reason)
          })
      } else {
        resolve(x)
      }
    } catch (reason) {
      if (called) return
      called = true
      reject(reason)
    }
  } else {
    resolve(x)
  }
}

class Promise {

  constructor(excutor) {
    this.value = undefined
    this.reason = undefined
    this.status = STATUS.PENDDING
    this.onFullfilledCallBacks = []
    this.onRejectedCallBacks = []

    const resolve = (value) => {
      if (value instanceof Promise) return value.then(resolve, reject)
      let called = false
      if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
        try {
          const then = value.then
          if (typeof then === 'function') {
            // 默认是一个promise
            // x.then(resolve, reject) //这里可能还会有promise，得深度解析
            then.call(
              value,
              y => {
                if (called) return
                called = true
                resolvePromise(y, this, resolve, reject)
              },
              reason => {
                if (called) return
                called = true
                reject(reason)
              })
              return
          }
        } catch (reason) {
          if (called) return
          called = true
          reject(reason)
          return
        }
      }

      if (this.status === STATUS.PENDDING) {
        this.status = STATUS.FULLFILLED
        this.value = value
        this.onFullfilledCallBacks.forEach(onFullfilled => onFullfilled())
      }
    }

    const reject = (reason) => {
      if (this.status === STATUS.PENDDING) {
        this.status = STATUS.REJECTED
        this.reason = reason

        this.onRejectedCallBacks.forEach(onRejected => onRejected(this.reason))
      }
    }

    try {
      excutor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then = (onFullfilled, onRejected) => {
    onFullfilled = typeof onFullfilled == 'function' ? onFullfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.PENDDING) {
        this.onFullfilledCallBacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFullfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }

          }, 0)
        })
        this.onRejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }

          }, 0)
        })
        return
      }
      if (this.status === STATUS.FULLFILLED) {
        setTimeout(
          () => {
            try {
              const x = onFullfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }
          , 0)
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(
          () => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }
          , 0)
      }
    })
    return promise2
  }

  catch = (onRejected) => {
    return this.then(value => value, onRejected)
  }

  finally = (fn) => {
    const resolveFn = (value) => {
      fn()
      return value
    }
    const rejectFn = (reason) => {
      fn()
      throw reason
    }
    return this.then(resolveFn, rejectFn)
  }


  static resolve = (value) => {
    return new Promise(resolve => resolve(value))
  }

  static race = (arr) => {
    if (!Array.isArray(arr)) throw new Error('argument must be array')
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < arr.length; i++) {
          Promise.resolve(arr[i]).then(resolve, reject)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  static all = (arr) => {
    if (!Array.isArray(arr)) throw new Error('argument must be array')
    let valueArr = []
    let count = 0
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < arr.length; i++) {
          Promise.resolve(arr[i]).then((value) => {
            valueArr[i] = value
            if (++count === arr.length) {
              resolve(valueArr)
            }
          }, reject)
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}
// promises-aplus-tests index.js
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise

```