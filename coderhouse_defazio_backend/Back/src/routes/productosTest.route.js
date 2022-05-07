import express  from 'express';
import Productos from '../controlers/productosTest.controler.js';
import auth from '../middle/auth.middle.js';

const routerProdTest = express.Router();
const prod = new Productos();

routerProdTest.get("/", auth, (req, res) => {
    prod.getAll(p => {
        res.status(200).json(p);
    });
});

export default routerProdTest;