import express  from 'express';
import Usuarios from '../controlers/usuarios.controler.js';
import auth from '../middle/auth.middle.js';
import passport from "../utils/passport.util.js";
import * as AuthController from "../controlers/auth.controler.js";

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

routerUsuarios.post("/login",
    passport.authenticate("login", { failureRedirect: "/api/usuario/failLogin" }),
    AuthController.postLogin,
);
routerUsuarios.get("/failLogin", AuthController.failLogin);

routerUsuarios.post("/",
    passport.authenticate("signup", { failureRedirect: "/api/usuario/failSignup" }),
    AuthController.postSignup,
);

routerUsuarios.get("/failSignup", AuthController.failSignup);

routerUsuarios.get("/logout", AuthController.logout);

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