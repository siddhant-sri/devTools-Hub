import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsGateway } from './logs.gateway';

@Controller('logs')
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
    private readonly logsGateway: LogsGateway
  ) {}

  @Get()
  async getLogs(@Query() query: any) {
    return this.logsService.findAll(query);
  }

  @Post()
  async createLog(@Body() body: any) {
    const log = await this.logsService.create({
      level: body.level || 'info',
      message: body.message || 'Test message',
      serviceName: body.serviceName || 'test-service',
      context: body.context || {},
    });
    // Broadcast via websocket
    this.logsGateway.server.emit('new_log', log);
    return log;
  }
}
