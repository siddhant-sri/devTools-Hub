import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LogsService } from './logs.service';

@WebSocketGateway({ 
  cors: { 
    origin: process.env.CORS_ORIGIN === '*' ? true : (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*'),
    credentials: true,
  } 
})
export class LogsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly logsService: LogsService) {}

  @SubscribeMessage('send_log')
  async handleLogEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const log = await this.logsService.create({
      level: data.level || 'info',
      message: data.message || '',
      serviceName: data.serviceName || 'unknown',
      context: data.context || {}
    });
    
    // Broadcast down to any subscribed UIs
    this.server.emit('new_log', log);
    return { status: 'ok' };
  }
}
