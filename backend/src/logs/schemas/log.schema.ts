import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  level: string; // 'info', 'warning', 'error'

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ type: Object })
  context?: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);
