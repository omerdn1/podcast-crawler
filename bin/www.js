import { createServer } from 'http';
import app from 'config/app';

require('dotenv').config();

// Event listener for HTTP server "error" event
const onError = (error) => {
  if (error.syscall !== 'listen') throw error;

  // Handle specific listen errors
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener
const onListening = () => {
  const addr = server.address();
  console.log(`Listening on port ${addr.port}`);
};

// Port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = createServer(app);

// Listen on provided port
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
