import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);
const staticPath = path.join(__dirname, '../static');
const port = process.env.PORT || 2000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) =>{
    console.log('A client has just connected to server!');

    socket.broadcast.emit('joined', `A new user just joined the chat at ${new Date().getTime()}`);

    socket.emit('enter', {
        from: 'Admin', 
        text: 'Welcome to the chat room!'
    });

    socket.on('disconnect', ()=>{
        console.log('client has disconnected!');
    });

    socket.on('createMessage', function(data){
        console.log('createMessage', data);
        socket.emit('newMessage', `Hello ${data.from}, welcome again to the chat room!`);

        socket.broadcast.emit('newMessage', {
            from: data.from,
            text: data.text,
            createdAt: new Date().getTime()
        })

    });

})



app.use(express.static(staticPath));

server.listen(port, ()=>{
    console.log(`Now listening on port ${port}`);
});