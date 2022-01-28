const express = require("express")
const indexRoutes = require("./routes/indexRoutes");
const productsRoutes = require("./routes/productsRoutes")

class App {
    app
    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }
    config(){
        this.app.use( express.json() );
        this.app.use( express.urlencoded({extended: false}));
        this.app.set("port", 8080)
        this.app.use( express.static('public') );
    }
    routes() {
        this.app.use("/", indexRoutes);
        this.app.use("/api/productos",productsRoutes)
    }
    listen() {
        this.app.listen( this.app.get("port") , () => {
            console.log("Servidor corriendo en puerto", this.app.get("port"));
        });
    }
}

const app = new App()
app.listen()
