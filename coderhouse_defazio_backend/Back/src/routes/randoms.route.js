import express  from 'express';
import { fork } from "child_process";

const routerRandoms = express.Router();
const computo = fork(`./src/utils/calculo.util.js`);


routerRandoms.get("/", (req, res) => {
    let cant = req.query.cant;
    if (cant === undefined) cant = 100000000;
    computo.on("message", (rsdo) => {
        res.status(200).send({ rsdo });
      });
    computo.send(cant);
});

export default routerRandoms