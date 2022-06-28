const express = require('express');
require('dotenv').config();

const cors = require('cors');

const http = require('http')
const {Server} = require('socket.io')

const router = require('./src/routes');

const app = express();

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_CLIENT_URL || 
    "https://loquacious-mooncake-e00a17.netlify.app" || 
    process.env.CLIENT_URL,
  },
});

require('./src/socket')(io);

const port = process.env.PORT || 'https://b34-backend.herokuapp.com/api/v1' || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/v1/', router);
app.use('/uploads', express.static('uploads'));

server.listen(port, () => console.log(`Listening on port ${port}!`))