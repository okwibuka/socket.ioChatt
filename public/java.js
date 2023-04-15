
const socket = io()
const chattForm = document.getElementById('chat__form')
const messages__container = document.querySelector('.messages__container')

//get username and room from the url(by using the qs library)
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
// console.log(username , room)

socket.emit('joinRoom' , {username , room} , (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})

socket.on('message' , (message)=>{
    // console.log(message)
    outputMessage(message)
    messages__container.scrollTop = messages__container.scrollHeight
})

socket.on('roomUsers' , ({room , users}) =>{
    OutputRoomName(room)
    OutputRoomUsers(users)
})

chattForm.addEventListener('submit' , (e) =>{
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit('chatMessage' , msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function outputMessage(message)
{
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
<div class="user__name ">
<span class="name">${message.username}<span style="opacity: 0.5;margin-left:7px">${message.time}</span></span>
<br/>
<span class="sent__message"> <i class="bi bi-chat-fill"></i> ${message.text} </span>
</div>
`
    document.querySelector('.messages__container').appendChild(div)
}

function OutputRoomName(room){
    // const div = document.createElement('div')
    // div.classList.add('room_name')
    // div.innerHTML = `
    // ${room}
    // `
    // document.querySelector('.room__container').appendChild(div)
    document.querySelector('.room_name').innerHTML = room
}

function OutputRoomUsers(users){
    document.querySelector('.users').innerHTML = `
    ${users.map(user => `<div class="list">${user.username}</div>`).join("")}
    `
}

//drop down scripts

centered_left = document.querySelector('.centered__left')
dropdown_lists = document.querySelector('.view__dropdown__lists')
close_list = document.querySelector('.close__list')


dropdown_lists.addEventListener('click', ()=>{
    centered_left.style.opacity = 1
})

close_list.addEventListener('click', ()=>{
    centered_left.style.opacity = 0
})