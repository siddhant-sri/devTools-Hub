import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionItem, CollectionItemDocument } from './schemas/collection.schema';

@Injectable()
export class CollectionsService {
  constructor(@InjectModel(CollectionItem.name) private collectionModel: Model<CollectionItemDocument>) {}

  async create(createDto: any): Promise<CollectionItem> {
    const createdItem = new this.collectionModel(createDto);
    return createdItem.save();
  }

  async findAll(): Promise<CollectionItem[]> {
    return this.collectionModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<CollectionItem> {
    const item = await this.collectionModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Collection item #${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: any): Promise<CollectionItem> {
    const existingItem = await this.collectionModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!existingItem) {
      throw new NotFoundException(`Collection item #${id} not found`);
    }
    return existingItem;
  }

  async remove(id: string): Promise<any> {
    const deletedItem = await this.collectionModel.findByIdAndDelete(id).exec();
    if (!deletedItem) {
      throw new NotFoundException(`Collection item #${id} not found`);
    }
    return deletedItem;
  }
}
