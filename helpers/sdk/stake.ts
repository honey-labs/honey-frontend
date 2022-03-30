import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import {
  HONEY_MINT,
  PHONEY_MINT,
  STAKE_PROGRAM_ID,
  POOL_USER_SEED,
  VAULT_AUTHORITY_SEED
} from './constant';
import stakeIdl from '../idl/stake.json';
import { Stake } from '../types/stake';

export class StakeClient {
  private connection: Connection;
  public wallet: anchor.Wallet;
  private provider!: anchor.Provider;
  private program!: anchor.Program<Stake>;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.setProvider();
    this.setStakeProgram();
  }

  setProvider() {
    this.provider = new anchor.Provider(
      this.connection,
      this.wallet,
      anchor.Provider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setStakeProgram() {
    this.program = new anchor.Program<Stake>(
      stakeIdl as any,
      STAKE_PROGRAM_ID,
      this.provider
    );
  }

  async fetchPoolInfo(pool: PublicKey) {
    try {
      return this.program.account.poolInfo.fetch(pool);
    } catch (e) {
      console.log(e);
    }
  }

  async fetchPoolUser(user: PublicKey) {
    try {
      return this.program.account.poolUser.fetch(user);
    } catch (e) {
      console.log(e);
    }
  }

  async initializeUser(pool: PublicKey) {
    const [user, userBump] = await this.getUserPDA(pool);

    const txSig = await this.program.rpc.initializeUser({
      accounts: {
        payer: this.wallet.publicKey,
        poolInfo: pool,
        userInfo: user,
        userOwner: this.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    });

    return { user, userBump, txSig };
  }

  async deposit(
    pool: PublicKey,
    user: PublicKey,
    source: PublicKey,
    amount: anchor.BN
  ) {
    const txSig = await this.program.rpc.deposit(new anchor.BN(amount), {
      accounts: {
        poolInfo: pool,
        userInfo: user,
        userOwner: this.wallet.publicKey,
        pTokenMint: PHONEY_MINT,
        source,
        userAuthority: this.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });

    return { txSig, amount };
  }

  async claim(pool: PublicKey, user: PublicKey, destination?: PublicKey) {
    if (!destination) {
      destination = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        HONEY_MINT,
        this.wallet.publicKey
      );
    }

    const [authority] = await this.getPoolAuthorityPDA(pool);

    const txSig = await this.program.rpc.claim({
      accounts: {
        payer: this.wallet.publicKey,
        poolInfo: pool,
        authority,
        tokenMint: HONEY_MINT,
        userInfo: user,
        userOwner: this.wallet.publicKey,
        destination,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });

    return { destination, txSig };
  }

  async getUserPDA(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(POOL_USER_SEED),
        pool.toBuffer(),
        this.wallet.publicKey.toBuffer()
      ],
      this.program.programId
    );
  }

  async getPoolAuthorityPDA(pool: PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VAULT_AUTHORITY_SEED), pool.toBuffer()],
      this.program.programId
    );
  }
}