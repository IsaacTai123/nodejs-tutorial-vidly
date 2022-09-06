
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {  // 這邊return這個 standard Express Route Handler function 是因為我們需要的是reference function. 之後再由Express在runtime時呼叫
     try {
      await handler(req, res) // 這邊需要傳入 req, res 參數
    } catch (ex) {
      /* handle error */
      next(ex);
    }
  }
}
