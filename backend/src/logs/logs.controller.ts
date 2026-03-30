import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';
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
    this.logsGateway.server.emit('new_log', log);
    return log;
  }

  @Delete()
  async clearLogs() {
    await this.logsService.removeAll();
    // Broadcast clearance to all clients if needed, or they can just wipe local state
    this.logsGateway.server.emit('clear_logs');
    return { success: true };
  }
}
