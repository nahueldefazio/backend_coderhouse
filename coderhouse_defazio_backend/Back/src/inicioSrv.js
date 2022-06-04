import 'dotenv/config';
import Server from './server.js';
//import minimist from 'minimist';

const options = {
    default: {
       port: 8080
    }
}
//const arg = minimist(process.argv.slice(2), options);
//const PORT = arg.port || 8080;
console.log(process.argv)
const PORT = parseInt(process.argv[2]) || 8080;
try {
  const server = new Server(PORT)
  await server.start()
  await server.listen()
} catch (error) {
  console.log(`error ${error}`)
}