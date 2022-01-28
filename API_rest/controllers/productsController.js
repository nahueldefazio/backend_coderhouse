const {Response, Request} = require("express")
const fs = require("fs");
const path = require("path")

let db = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/productos.json"), 'utf-8'))

class ProductsController {

    getAll(req = Request, res = Response) {
        res.json(db)
    }

    getOne(req = Request, res = Response) {

        try {
            const producto = db.find(ele => ele.id == req.params.id)
            if (!producto) throw new Error()
            res.json(producto)
        } catch (e) {
            res.json('Producto inexistente')
        }
    }

    async deleteOne(req = Request, res = Response) {
        try {
            const largo = db.length
            db = db.filter(producto => producto.id != req.params.id)
            if (largo === db.length) {
                throw new Error()
            }
            await fs.promises.writeFile(path.join(__dirname, "../public/productos.json"), JSON.stringify(db))
            res.json("Producto eliminado correctamente")
        } catch (e) {
            res.json("No se encontro el id ingresado")
        }
    }

    async updateOne(req = Request, res = Response) {
        try {
            let producto = db.find(ele => ele.id == req.params.id)
            if (!producto) throw new Error("Id")
            const index = db.findIndex(ele => ele.id == req.params.id)
            const body = req.body
            const {title, price, thumbnail} = body

            if (!title || !price || !thumbnail) throw new Error("Body")
            producto = {
                id: producto.id,
                title,
                price,
                thumbnail
            }
            db[index] = producto
            await fs.promises.writeFile(path.join(__dirname, "../public/productos.json"), JSON.stringify(db))
            res.json("Producto actualizado")

        } catch (e) {
            if (e.message == "Id"){
                res.json('Producto inexistente')
            }else if (e.message == "Body"){
                res.json('Body vacio o incompleto')
            }

        }
    }

    async createProduct(req = Request, res = Response) {
        const body = req.body
        const {title, price, thumbnail} = body


        const producto = {
            id: 1,
            title,
            price,
            thumbnail
        }
        producto.id = db.length === 0 ? 1 : Math.max(...db.map(producto => producto.id)) + 1
        db.push(producto)
        await fs.promises.writeFile(path.join(__dirname, "../public/productos.json"), JSON.stringify(db))
        res.json({
            text: "Producto creado"
        })
    }
}

const productsController = new ProductsController()
module.exports = {
    productsController
}
