import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.collectionsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.collectionsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
