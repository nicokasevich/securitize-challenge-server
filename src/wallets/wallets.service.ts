import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import appenv from 'src/config/appenv';
import { HttpService } from '@nestjs/axios';
import { Transaction } from 'src/transactions/schemas/transaction.schema';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    private readonly httpService: HttpService,
  ) {}

  async index(): Promise<Wallet[]> {
    return this.walletModel.find().exec();
  }

  async store(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const createdWallet = new this.walletModel(createWalletDto);
    return createdWallet.save();
  }

  async show(id: string): Promise<Wallet> {
    return this.walletModel.findById(id);
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return this.walletModel.findByIdAndUpdate(id, updateWalletDto);
  }

  async delete(id: string): Promise<Wallet> {
    return this.walletModel.findByIdAndDelete(id);
  }

  async balance(address: string): Promise<any> {
    let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${appenv.ETHERSCAN_API_KEY}`;

    const response = await this.httpService
      .get(url)
      .pipe(map((res) => res.data.result));

    return firstValueFrom(response);
  }

  async oldestTransaction(address: string): Promise<Transaction> {
    const response = this.httpService
      .get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${appenv.ETHERSCAN_API_KEY}`,
      )
      .pipe(
        map((axiosResponse: AxiosResponse) => axiosResponse.data.result[0]),
      );

    return firstValueFrom<Transaction>(response);
  }
}
