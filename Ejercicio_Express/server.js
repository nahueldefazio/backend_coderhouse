const express = require("express")
const genHash = require("./hashService")
const fs = require('fs')

const app = express()

const db =  JSON.parse(fs.readFileSync(__dirname + '/productos.json', 'utf-8'))

app.use(express.json())

app.get("/producto/:id", (req,res)=>{
    const producto = db.find(ele => ele.id === req.params.id)
    res.json(producto)
})
app.get("/productos", (req,res)=>{
    res.send(db)
})
app.post("/producto",async (req,res)=>{
    const body = req.body
    const {title, price, thumbnail} = body
    const hashedId = await genHash(JSON.stringify(body))
    const producto = {
        id: hashedId,
        title,
        price,
        thumbnail
    }
    producto.id = producto.id.replace("/","a")
    db.push(producto)
    await fs.promises.writeFile(__dirname + '/productos.json', JSON.stringify(db))


    res.send({
        hashedId,
        title,
        price,
        thumbnail
    })
})



const server = app.listen(8080, ()=>{
    console.log(`Servidor corriendo en el puerto ${server.address().port}`)
})
server.on("error", error => {
    console.log(`Error en servidor ${error}`)
})
