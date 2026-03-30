import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(createLogDto: any): Promise<Log> {
    const createdLog = new this.logModel(createLogDto);
    return createdLog.save();
  }

  async findAll(query: any): Promise<Log[]> {
    const filters: any = {};
    if (query.level) filters.level = query.level;
    if (query.serviceName) filters.serviceName = query.serviceName;
    if (query.search) filters.message = { $regex: query.search, $options: 'i' };
    
    return this.logModel.find(filters).sort({ createdAt: -1 }).limit(100).exec();
  }

  async removeAll(): Promise<{ deletedCount: number }> {
    return this.logModel.deleteMany({}).exec();
  }
}
