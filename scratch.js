const rooms = {
    room: {
        users: [{
            username: "sbeve",
            id: "id"
        }],
        messages: [{
            username: "sbeve",
            message: "message content"
        }]
    }
}

console.log(rooms.room.messages[0].message);