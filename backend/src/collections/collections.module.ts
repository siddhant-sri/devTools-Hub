import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CollectionItem, CollectionItemSchema } from './schemas/collection.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CollectionItem.name, schema: CollectionItemSchema }])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
