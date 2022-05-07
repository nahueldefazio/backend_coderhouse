import express  from 'express';
import Usuarios from '../controlers/usuarios.controler.js';
import auth from '../middle/auth.middle.js';

const routerUsuarios = express.Router();
const usuarios = new Usuarios();

routerUsuarios.get("/:id", auth, async (req, res) => {
    const { ...rest } = req.params;
    const id = rest.id;
    await usuarios.getById(id, u => {
        if(u===undefined){
            res.status(400).json({error: 'usuario No Encontrado.'})
        } else {
            res.status(200).json(u);
        }
    });       
});

routerUsuarios.get("/email/:email", async (req, res) => {
    const { ...rest } = req.params;
    const pass = req.query.pass;
    const email = rest.email;
    await usuarios.getByMail(email, pass, u => {
        if (u.length>0) {
            req.session.login = true;
        } else {
            req.session.login = false;
        }
        res.status(200).json(u);
    });
});

routerUsuarios.post("/", async (req, res) => {
    try {
        const datos  = req.body;
        await usuarios.altaUsuario(datos, usuario => {
            res.status(200).json(usuario);
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
});

routerUsuarios.put("/:id", auth, async (req, res) => {
    try {
        const usuarioN = req.body;
        await usuarios.modiUsuario(usuarioN, u => {
            res.status(200).json(u);
        });
    } catch (err) {
        res.status(400).json({error: err});
    } 
});

routerUsuarios.delete("/:id", auth, async (req, res) => {
    try {
        const { ...rest } = req.params;
        const id = rest.id;
        await usuarios.deleteById(id, c => {
            res.status(200).json(c);
        });
    } catch (err) {
        res.status(400).json({error: err});
    }
});

export default routerUsuarios;