const fetchFn = window.fetch

window.fetch.polyfill = false
fetchFn.polyfill = false

export default fetchFn

const { Request, Response, Headers } = window

export { Request, Response, Headers }
