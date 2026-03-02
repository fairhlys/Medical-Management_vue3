// 通用防抖：delay 时间内只执行最后一次
export function createDebouncedRequest(fn, delay = 300) {
  let timer = null
  let controller = null
  let requestId = 0

  return function (...args) {
    if (timer) clearTimeout(timer)

    // 取消上一次请求
    if (controller) {
      controller.abort()
    }

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        controller = new AbortController()
        const currentId = ++requestId

        try {
          const result = await fn(...args, controller.signal)

          // 防止响应乱序
          if (currentId === requestId) {
            resolve(result)
          }
        } catch (err) {
          if (err.name !== 'AbortError') {
            reject(err)
          }
        }
      }, delay)
    })
  }
}

// 通用节流（时间戳版）：每 delay 最多执行一次
export function throttle(fn, delay = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
