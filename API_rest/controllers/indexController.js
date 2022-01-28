const {Response, Request} = require("express")

class IndexController {
    index(req = Request, res = Response){
        res.sendFile(path.resolve(__dirname, "./public/index.html"));
    }
}

const indexController = new IndexController()
module.exports = {
    indexController
}
