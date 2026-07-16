
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // allow frontend connections
export class ChatGateway {
  @WebSocketServer() server!: Server;//server! means

  // Handle joining a room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    client.emit('joinedRoom', `You joined room: ${room}`);
  }

  // Handle sending a message
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(payload.room).emit('receiveMessage', {
      user: client.id,
      message: payload.message,
    });
  }
}
