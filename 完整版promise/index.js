
const STATUS = {
  PENDDING: 'PENDDING',
  FULLFILLED: 'FULLFILLED',
  REJECTED: 'REJECTED',
}

const resolvePromise = (resolve, reject, x, promise2) => {
  let called = false // 该promise是否被解析过，主要针对thenable对象
  if (x === promise2) {
    throw new Error('xxxxxxxxxxxxxxx')
  }
  if (typeof x === 'object' || typeof x === 'function' && x != null) {
    if (typeof x.then === 'function') {
      // 默认是一个promise
      // x.then(resolve, reject) //这里可能还会有promise，得深度解析
      x.then(
        value => {
          if (called) return
          called = true
          resolvePromise(resolve, reject, value, promise2)
        },
        reason => {
          if (called) return
          called = true
          reject(reason)
        })
      return
    }
  }
  resolve(x)
}

class Promise {

  constructor(excutor) {
    this.value = ''
    this.reason = ''
    this.status = STATUS.PENDDING
    this.onFullfilledCallBacks = []
    this.onRejectedCallBacks = []

    const resolve = (value) => {

      let called = false
      if (typeof value === 'object' || typeof value === 'function' && x != null) {
        if (typeof value.then === 'function') {
          // 默认是一个promise
          // x.then(resolve, reject) //这里可能还会有promise，得深度解析
          value.then(
            nvalue => {
              if (called) return
              called = true
              resolvePromise(resolve, reject, nvalue, () => { })
            },
            reason => {
              if (called) return
              called = true
              reject(reason)
            })
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

  then = (
    onFullfilled = (res) => res,
    onRejected = reason => new Error(reason)
  ) => {
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.PENDDING) {
        this.onFullfilledCallBacks.push(() => {
          setTimeout(() => {
            const x = onFullfilled(this.value)
            resolvePromise(resolve, reject, x, promise2)
          }, 0)
        })
        this.onRejectedCallBacks.push(() => {
          setTimeout(() => {
            const x = onRejected(this.reason)
            resolvePromise(resolve, reject, x, promise2)
          }, 0)
        })
        return
      }
      if (this.status === STATUS.FULLFILLED) {
        setTimeout(
          () => {
            const x = onFullfilled(this.value)
            resolvePromise(resolve, reject, x, promise2)
          }
          , 0)
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(
          () => {
            const x = onRejected(this.reason)
            resolvePromise(resolve, reject, x, promise2)
          }
          , 0)
      }
    })
    return promise2
  }

  catch = (onRejected) => {
    return this.then(value => value, onRejected)
  }

  static resolve = (value) => {
    return new Promise(resolve => resolve(value))
  }
}

const pp1 = {
  then(onFulfilled, onRejected) {
    onFulfilled(new Promise((resolve1) => {
      setTimeout(() => {
        resolve1(456)
      }, 2000)
    }))
    onFulfilled(new Promise((resolve1) => {
      resolve1(233333)
    }))
    onRejected(789)
  }
}

new Promise((resolve) => {
  resolve(pp1)
  // resolve(new Promise(resolve=>{
  //   setTimeout(()=>{resolve('creazy____resolve')},3000)
  // }))
})
  .then((res) => {
    console.log('then1', res)
    return 'heheheh'
  })
  .then(res => {
    console.log('then2', res)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('promise Hahaha')
      }, 3000)
    })
  })
  .then(res => console.log('then3', res))


let p2 = new Promise(resolve => {
  resolve(1111)
}).then(() => {
  const pp1 = {
    then(onFulfilled, onRejected) {
      onFulfilled(new Promise((resolve1) => {
        setTimeout(() => {
          resolve1(456)
        }, 2000)
      }))
      onFulfilled(new Promise((resolve1) => {
        resolve1(233333)
      }))
      onRejected(789)
    }
  }
  return pp1
}).then((value) => {
  console.log('fulfilled:----------', value)
}, (reason) => {
  console.log('rejected:-----------', reason)
})
