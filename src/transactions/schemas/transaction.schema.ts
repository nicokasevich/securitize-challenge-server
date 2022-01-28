import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop()
  timeStamp: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
