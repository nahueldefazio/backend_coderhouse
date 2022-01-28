const { productsController } = require("../controllers/productsController") ;
const { getAll, createProduct, getOne, deleteOne, updateOne } = productsController


class ProductsRoutes{
    router = require("express").Router()
    constructor() {

        this.config()
    }
    config(){
        this.router.get("/", getAll)
        this.router.post("/", createProduct)
        this.router.get("/:id", getOne)
        this.router.delete("/:id", deleteOne)
        this.router.put("/:id", updateOne)
    }

}

const productsRoutes = new ProductsRoutes()
module.exports = productsRoutes.router
