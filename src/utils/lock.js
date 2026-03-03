export function createRequestLock(fn) {
  let pending = false

  return async function (...args) {
    if (pending) return
    pending = true

    try {
      return await fn(...args)
    } finally {
      pending = false
    }
  }
}
//请求锁
