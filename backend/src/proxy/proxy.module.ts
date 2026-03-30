import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LogsModule } from '../logs/logs.module';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule, LogsModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
