
import { ChatClass } from "../models/chat.model";
import { UserModel } from "../models/user.model";
import { RoomModel } from "../models/room.model";
import { Room } from "../interfaces/room";

const mongo = new ChatClass();
const userModel = new UserModel();
const roomModel = new RoomModel();

export class ChatSocket {
    public io: SocketIO.Server;
    public socket: SocketIO.Socket;
    constructor(io: SocketIO.Server) {
        this.io = io;
        this.connect();
    }
    private connect() {
        this.io.on('connect', (socket: SocketIO.Socket) => {
            console.log("Connected client on port http://localhost:%s.", 5000);
            this.socket = socket;
            socket.on('remove', this.removeMessageFromRoom)
            socket.on('roomMessage', this.sendMessageToRoom)
            socket.on('createRoom', this.createRoom);
            socket.on('getRoom', this.getRoom);
            socket.on('disconnect', this.disconnected);
        })
    }

    private createRoom = (room: Room) => {
        roomModel.model.create({ sender: room.sender, receiver: room.receiver })
            .then(res => this.io.emit('createRoom', res._id))
            .catch()
    }
    private getRoom = (id: string) => {
        roomModel.model.findById(id)
            .then(res => this.io.emit('getRoom', res))
            .catch()
    }

    private sendMessageToRoom = (room) => {
        if (typeof room !== 'string') {
            this.socket.join(room.room)
            mongo.model.exists({ room: room.room })
                .then(exist => {
                    if (exist) {
                        mongo.create({
                            room: room.room, message: room.message, sender:
                                { id: room.user.id, fullName: room.user.fullName, image: room.user.image }
                        })
                            .then(res => {
                                mongo.model.find({ room: room.room }).then(res => {
                                    const messages = res.map(msg => {
                                        return {
                                            id: msg._id,
                                            room: msg.room,
                                            message: msg.message,
                                            user: msg.sender,
                                            createdAt: msg.createdAt
                                        }
                                    })
                                    this.io.to(room.room).emit('roomMessage', messages)
                                })
                            });
                    } else {
                        mongo.create({
                            room: room.room, message: room.message, sender:
                                { id: room.user.id, fullName: room.user.fullName, image: room.user.image }
                        })
                            .then(msg => {
                                this.io.to(room.room).emit('roomMessage', [{
                                    id: msg._id,
                                    room: msg.room,
                                    message: msg.message,
                                    user: msg.sender,
                                    createdAt: msg.createdAt
                                }])
                            });
                    }
                })
        } else {
            this.socket.join(room)
            mongo.model.find({ room }).then(res => {
                const messages = res.map(msg => {
                    return {
                        id: msg._id,
                        room: msg.room,
                        message: msg.message,
                        user: msg.sender,
                        createdAt: msg.createdAt
                    }
                })
                this.io.to(room).emit('roomMessage', messages)
            })
        }
    }

    private removeMessageFromRoom = (message: any) => {
        this.socket.join(message.room)
        mongo.model.findByIdAndRemove(message.id)
            .then(res => {
                mongo.model.find({ room: message.room }).then(res => {
                    const messages = res.map(msg => {
                        return {
                            id: msg._id,
                            room: msg.room,
                            message: msg.message,
                            user: msg.sender,
                            createdAt: msg.createdAt
                        }
                    })
                    this.io.to(message.room).emit('roomMessage', messages)
                })
            })
            .catch(err => this.io.to(message.room).emit(err))
    }

    private disconnected = () => {
        console.log("Client disconnected");
    }
}
