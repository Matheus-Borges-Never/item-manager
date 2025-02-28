import { Module } from '@nestjs/common';
import { ItemController } from 'src/controller/item.controller';
import { ItemService } from 'src/service/item.service';
import * as mongoose from 'mongoose';
import { ItemSchema } from 'src/schema/item.schema';

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    {
      provide: 'ITEM_MODEL',
      useFactory: () => {
        return mongoose.model('Item', ItemSchema);
      },
    },
  ],
})
export class ItemModule {}
