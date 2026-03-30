import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { LogsService } from '../logs/logs.service';
import { LogsGateway } from '../logs/logs.gateway';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logsService: LogsService,
    private readonly logsGateway: LogsGateway,
  ) {}

  async makeRequest(proxyRequest: { url: string; method: string; headers?: any; body?: any; params?: any }) {
    const { url, method = 'get', headers = {}, body, params = {} } = proxyRequest;
    
    const startTime = Date.now();
    let response;
    let isError = false;
    
    try {
      response = await firstValueFrom(
        this.httpService.request({
          url,
          method: method.toLowerCase(),
          headers: headers,
          data: body ? body : undefined,
          params: params,
        })
      );
    } catch (e) {
      const error = e as AxiosError;
      response = error.response || { 
        status: 500, 
        statusText: 'Proxy Error', 
        data: error.message, 
        headers: {} 
      };
      isError = !!error.response;

      this.logsService.create({
        level: 'error',
        message: `Proxy failed for ${method.toUpperCase()} ${url} - ${error.message}`,
        serviceName: 'devtools-proxy',
        context: { url, method, data: response.data },
      }).then(log => this.logsGateway.server.emit('new_log', log));
    }

    const endTime = Date.now();

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      timeMs: endTime - startTime,
      isError,
    };
  }
}
