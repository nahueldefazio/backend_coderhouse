import routerProd from "./routes/productos.route.js";
import routerProdTest from "./routes/productosTest.route.js";
import routerCarrito from "./routes/carrito.route.js";
import routerUsuarios from "./routes/usuario.route.js";
import express  from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server as SocketSrv } from 'socket.io';
import Mensajes from "./controlers/mensajes.controler.js";
import session from 'express-session';
import mongoStore from 'connect-mongo';
import 'dotenv/config';


const port = process.env.PORT_SRV;
const app = express();
const server = http.createServer(app);
const io = new SocketSrv(server, {
   cors: { origin: '*'}
});
const msgsClass = new Mensajes();

app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
   credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
   name: 'CREDENCIALES',
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
      maxAge: 1000 * 60,
      sameSite: false
   },
   rolling: true
}));
app.use("/api/productos", routerProd);     
app.use("/api/productos-test", routerProdTest);     
app.use("/api/carrito", routerCarrito);
app.use("/api/usuario", routerUsuarios);
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
