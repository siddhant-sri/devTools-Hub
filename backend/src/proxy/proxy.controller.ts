import { Controller, Post, Body } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  async handleProxy(@Body() body: { url: string; method: string; headers?: any; body?: any; params?: any }) {
    return this.proxyService.makeRequest(body);
  }
}
