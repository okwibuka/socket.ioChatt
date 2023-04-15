
const users = []

function userJoin(id,username,room){

     username = username.trim().toLowerCase()

     const exist = users.find((user) => user.room === room && user.username === username)
     if(exist)
     {
        return { error: 'such user is in use!!'}
     }
     if(username.length > 10){
        return { error: 'maximum length is 10 characters!!'}
     }
    const user = {id,username,room}

    users.push(user)
    return {user}
}

function getCurrentUser(id){
    return users.find(user => user.id === id)
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id)
    if(index !== -1)
    {
        return users.splice(index , 1)[0]
    }
}

function getUsersRoom(room)
{
    return users.filter((user) => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getUsersRoom
}