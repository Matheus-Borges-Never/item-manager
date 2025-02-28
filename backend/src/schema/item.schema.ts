import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: Date.now })
  criadoEm: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
