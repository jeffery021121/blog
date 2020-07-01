
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

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}


// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject(1)
//   }, 50)
// })

// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject(22)
//   }, 100)
// })

// let p3 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(3)
//   }, 700)
// })

// Promise.race([p2, p3, p1])
//   .then(res => console.log(222, res))
//   .catch(err => console.log(11111, err)) // 1

module.exports = Promise


const pp1 = {
  then(onFulfilled, onRejected) {
    onFulfilled(new Promise((resolve1) => {
      setTimeout(() => { resolve1(456) }, 2000)
    }))
    onFulfilled(new Promise((resolve1) => { resolve1(233333) }))
    onRejected(789)
  }
}
// new Promise((resolve) => {
//   resolve(pp1)

// })
//   .then((res) => { console.log('then1', res)    return 'heheheh' })
//   .then(res => { console.log('then2', res)    return new Promise((resolve, reject) => { setTimeout(() => { resolve('promise Hahaha') }, 3000) }) })
//   .then(res => console.log('then3', res))

new Promise(resolve => {
  resolve(pp1)
  // resolve(111)
})
  // .then(res => { return pp1 })
  .then(res => console.log(111, res), reason => console.log(222, reason))