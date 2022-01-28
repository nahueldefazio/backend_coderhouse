const { indexController } = require("../controllers/indexController") ;
const { index } = indexController


class IndexRoutes{
    router = require("express").Router()
    constructor() {

        this.config()
    }
    config(){
        this.router.get("/", index)
    }

}

const indexRoutes = new IndexRoutes()
module.exports = indexRoutes.router
