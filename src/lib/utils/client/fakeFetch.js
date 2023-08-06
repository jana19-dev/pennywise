export default function fakeFetch() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ok = Math.random() > 0.5
      if (!ok) {
        reject(new Error(`fake error`))
      } else {
        resolve({
          ok: true,
          json: { message: `ok` }
        })
      }
    }, 1000)
  })
}
