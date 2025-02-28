import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Item, ItemDocument } from 'src/schema/item.schema';
import { CreateItemDto } from 'src/dto/create-item.dto';
import { UpdateItemDto } from 'src/dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @Inject('ITEM_MODEL')
    private itemModel: Model<ItemDocument>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = new this.itemModel(createItemDto);
    return newItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado`);
    }
    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException(`Item com ID ${id} não encontrado`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Item com ID ${id} não encontrado`);
    }
  }
}
