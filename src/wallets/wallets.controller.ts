import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { toNumber } from 'lodash';
import { Model } from 'mongoose';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  @Get()
  async index(): Promise<Wallet[]> {
    return await this.walletsService.index();
  }

  @Put()
  async store(@Body() createWalletDto: CreateWalletDto): Promise<Wallet> {
    const oldestTransaction = await this.walletsService.oldestTransaction(
      createWalletDto.address,
    );

    createWalletDto.oldest_transaction = oldestTransaction.timeStamp;

    let balance = await this.walletsService.balance(createWalletDto.address);

    createWalletDto.balance = (toNumber(balance) / 10e18).toString();

    let createdWallet = await this.walletsService.store(createWalletDto);

    return createdWallet;
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<Wallet> {
    return await this.walletsService.show(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    await this.walletsService.update(id, updateWalletDto);

    const updatedWallet = await this.walletsService.show(id);

    console.log(updatedWallet);

    return updatedWallet;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Wallet> {
    return this.walletsService.delete(id);
  }
}
