import minimist from 'minimist';
import routerProd from "./routes/productos.route.js";
import routerProdTest from "./routes/productosTest.route.js";
import routerCarrito from "./routes/carrito.route.js";
import routerUsuarios from "./routes/usuario.route.js";
import routerInfo from "./routes/info.route.js";
import routerRandoms from "./routes/randoms.route.js";
import express  from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketSrv } from 'socket.io';
import Mensajes from "./controlers/mensajes.controler.js";
import session from 'express-session';
import mongoStore from 'connect-mongo';
import 'dotenv/config';
import passport from "./utils/passport.util.js";

const options = {
   default: {
      port: 8080
   }
}
const arg = minimist(process.argv.slice(2), options);
const port = arg.port;
const app = express();
const server = http.createServer(app);
const io = new SocketSrv(server, {
   cors: { origin: '*'}
});
const msgsClass = new Mensajes();
const msgs = [];

app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
   credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
   store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      },
   }),    
   secret: process.env.SECRET,
   resave: true,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      maxAge: Number(process.env.EXPIRE),
      sameSite: false
   },
   rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/productos", routerProd);     
app.use("/api/productos-test", routerProdTest);     
app.use("/api/carrito", routerCarrito);
app.use("/api/usuario", routerUsuarios);
app.use("/api/info", routerInfo);
app.use("/api/randoms", routerRandoms);
app.get('*', (req, res) => {
   res.status(400).json({descripcion: `Ruta ${req.originalUrl} Inexistente.`});
});

io.on('connection', async (socket) => {
   console.log('Usuario Conectado');
   socket.emit('Bienvenida', {
      msg: '👍 Estamos en Línea para escucharte. 😎 '              
   });
   msgs = await msgsClass.Mostrar();
   io.sockets.emit('mensajeBack', msgs)
   
   socket.on('disconnect', () => {
         console.log('Usuario Desconectado');
         socket.emit('Bienvenida', '😇 Nos Vemos la Próxima. 😎 ' );
   });
   
   socket.on('notificacion', (data) => {
         console.log(`Recibido: ${data}`);
   })

   socket.on('mensajeFront', async (data) => {
      msgsClass.guardarYMostrar(socket.id, data, (msgs) => {
         io.sockets.emit('mensajeBack', msgs);
      });
   })
})

server.listen(port, () => {
   console.log(`Servidor Escuchando Y Listo en http://localhost:${port}`)
});
