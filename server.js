const express = require('express')
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const ACTIONS = require('./src/actions')
const path = require('path')

const server = http.createServer(app)
const io = new Server(server);

app.use(express.static('build'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'))
})
const userSocketMap = {};
function getAllConnectedClients(roomId){
    //io.sockets.adapter.room returns a map Array.from maps to arr
    return Array.from(io.sockets.adapter.rooms.get(roomId)|| []).map((socketId)=> {
        return{
            socketId,
            username: userSocketMap[socketId],
        }
    });
}
  
// TODO : Redis store
io.on('connection',(socket) =>{
    console.log('socket connected',socket.id);

    socket.on(ACTIONS.JOIN,({roomId,userName}) =>{
        console.log(userName);
        userSocketMap[socket.id] = userName;
        socket.join(roomId);

       const clients = getAllConnectedClients(roomId);
       console.log("all clients are ",clients);
       clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                 clients,
                 userName,
                 socketId: socket.id,
            });
       });
       
    });

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    })

    socket.on('disconnecting',()=>{
        const rooms = socket.rooms;
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId : socket.id,
                username : userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];

    });
});

io.on("connect_error",(err)=>{
    console.log(`connect_ error due to ${err.message}`)
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server connected on ${PORT}`))