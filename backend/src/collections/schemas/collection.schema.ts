import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionItemDocument = CollectionItem & Document;

@Schema({ timestamps: true })
export class CollectionItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Object })
  headers: any;

  @Prop({ type: Object })
  body: any;

  @Prop({ type: Object, default: {} })
  params: any;
}

export const CollectionItemSchema = SchemaFactory.createForClass(CollectionItem);
