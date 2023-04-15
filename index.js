const path = require('path')
const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const formatMessage = require('./public/utils/message')
const {userJoin , getCurrentUser ,userLeave , getUsersRoom} = require('./public/utils/users')

app.use(express.static(path.join(__dirname ,'public')))
const server = http.createServer(app)
const PORT = process.env.PORT || 2000

const io = socketio(server)

io.on('connection', socket =>{
    console.log('New socket connected...')

    socket.on('joinRoom' , ({username,room} , callback) =>{

    const {error , user} = userJoin(socket.id , username,room)

    if(error)
    {
        return callback(error)
    }
    
    socket.join(user.room)

    socket.emit('message' , formatMessage('Admin...', `${user.username} welcome to ${user.room} room`))
    socket.broadcast
    .to(user.room)
    .emit('message' , formatMessage('New Admin... ',`${user.username} has joined the chat`))

    //send users and room informations
    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users : getUsersRoom(user.room)
    })
   callback()
    })

    socket.on('chatMessage' , (msg) =>{

    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message' , formatMessage(user.username,msg))

    })

    socket.on('disconnect' , ()=>{

    const user = userLeave(socket.id)
    if(user){
    io
    .to(user.room)
    .emit('message' , formatMessage('New Admin... ',`${user.username} has left the chat room`)) 

    //send users and room informations
    io.to(user.room).emit('roomUsers',{
    room : user.room,
    users : getUsersRoom(user.room)
    })
}
    })

})

server.listen(PORT , ()=>{
console.log(`server is on port ${PORT}`)
})