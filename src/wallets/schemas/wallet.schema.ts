import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  id?: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: false })
  favorite: boolean;

  @Prop({ default: null })
  oldest_transaction: number;

  @Prop()
  balance: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
