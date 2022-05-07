import express  from 'express';
import Carrito from '../controlers/carrito.controler.js';
import auth from '../middle/auth.middle.js';

const routerCarrito = express.Router();
const carrito = new Carrito();

routerCarrito.get("/:id", auth, (req, res) => {
    const { ...rest } = req.params;
    const id = rest.id;
    carrito.getById(id, p => {
        if(p===undefined){
            res.status(400).json({error: 'Carrito No Encontrado.'})
        } else {
            res.status(200).json(p);
        }
    });       
});

routerCarrito.get("/usuario/:email", auth, (req, res) => {
    const { ...rest } = req.params;
    const email = rest.email;
    carrito.geByUs(email, ordenes => {
        res.status(200).json(ordenes);
    });
});

routerCarrito.post("/", auth, (req, res) => {
    try {
        const { datos, carrito, total, cantTotal } = req.body;
        carrito.generarOrden(datos, carrito, total, cantTotal, carrito => {
            res.status(200).json(carrito);
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
});

routerCarrito.put("/:id", auth, (req, res) => {
    try {
        const CarritoNuevo = req.body;
        carrito.modi(CarritoNuevo, c => {
            res.status(200).json(c);
        });
    } catch (err) {
        res.status(400).json({error: err});
    } 
});

routerCarrito.delete("/:id", auth, (req, res) => {
    try {
        const { ...rest } = req.params;
        const id = rest.id;
        carrito.deleteById(id, c => {
            res.status(200).json(c);
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
});

export default routerCarrito;