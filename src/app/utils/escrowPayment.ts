import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

export default class Escrow {
  xJobsVaultAddress: string; // xJobs escrow vault address
  xJobsFeeWalletAddress: string; // xJobs fee wallet address
  USDCxJobsVaultAddress: string; // xJobs USDC vault address
  USDCxJobsFeeWalletAddress: string; // xJobs USDC fee wallet address
  USDCAddress: string; // USDC token address

  constructor() {
    this.USDCAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    this.USDCxJobsFeeWalletAddress =
      "5U26mFyHX2HWbwf7bEKkYdTTz2qKf9sdZFm46hXPvEhS";
    this.USDCxJobsVaultAddress = "GyWaQDZ18EqLdkVFEFDq9MfeRKxB8VN5omHmQxPTj7BW";
    this.xJobsFeeWalletAddress = "E3CkQKCDeb7qJfCFhhQjSpiUBnTJT6R3P3ADAVjVirRu";
    this.xJobsVaultAddress = "81oQgcNqbA6yM1qFFZkbjUzNodq9FYiweVYpJ2MSg2qC";
  }

  public usePaySol(
    publicKey: PublicKey,
    connection: Connection,
    sendTransaction: (
      transaction: Transaction,
      connection: Connection
    ) => Promise<string>
  ) {
    const NUM_DROPS_PER_TX = 3;
    const TX_INTERVAL = 1000;

    async function generateTransactions(batchSize: number, dropList: any) {
      try {
        let result = [];
        let txInstructions = dropList.map((drop: any) => {
          return SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(drop.walletAddress),
            lamports: LAMPORTS_PER_SOL * drop.numLamports,
          });
        });
        const numTransactions = Math.ceil(txInstructions.length / batchSize);
        for (let i = 0; i < numTransactions; i++) {
          let bulkTransaction = new Transaction();
          let lowerIndex = i * batchSize;
          let upperIndex = (i + 1) * batchSize;
          for (let j = lowerIndex; j < upperIndex; j++) {
            if (txInstructions[j]) bulkTransaction.add(txInstructions[j]);
          }
          bulkTransaction.feePayer = publicKey;
          bulkTransaction.recentBlockhash = (
            await connection.getLatestBlockhash()
          ).blockhash;

          result.push(bulkTransaction);
        }

        return result;
      } catch (error) {
        return error;
      }
    }

    async function executeTransactions(transactionList: any) {
      let staggeredTransactions = await transactionList.map(
        (transaction: any, i: any) => {
          return new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                const signature = await sendTransaction(
                  transaction,
                  connection
                );

                let txSuccess = false;
                while (!txSuccess) {
                  const {
                    value: txStatus,
                  } = await connection.getSignatureStatus(signature);

                  if (
                    txStatus &&
                    (txStatus.confirmationStatus === "confirmed" ||
                      txStatus.confirmationStatus === "finalized")
                  ) {
                    txSuccess = true;
                    resolve({ signature: signature });
                    break;
                  } else {
                    resolve({ status: { state: "rejected, funds returned" } });
                    break;
                  }
                }
              } catch (error) {
                reject(error);
              }
            }, i * TX_INTERVAL);
          });
        }
      );
      let result = await Promise.all(staggeredTransactions);
      return result[0];
    }

    async function transfer(amount: number) {
      const dropList = [
        {
          // walletAddress: this.xJobsFeeWalletAddress,
          walletAddress: "E3CkQKCDeb7qJfCFhhQjSpiUBnTJT6R3P3ADAVjVirRu",
          numLamports: (amount * 0.02).toFixed(6),
        },
        {
          // walletAddress: this.xJobsVaultAddress,
          walletAddress: "81oQgcNqbA6yM1qFFZkbjUzNodq9FYiweVYpJ2MSg2qC",
          numLamports: (amount * 0.98).toFixed(6),
        },
      ];

      const transactionList = await generateTransactions(
        NUM_DROPS_PER_TX,
        dropList
      );

      const txResults = await executeTransactions(transactionList);

      return txResults.status;
    }

    return { transfer };
  }

  public usePayUSDC(
    connection: Connection,
    publicKey: PublicKey,
    sendTransaction: (
      transaction: Transaction,
      connection: Connection
    ) => Promise<string>
  ) {
    // Token
    const valueTokenAddress = this.USDCAddress;
    // const valueTokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const mint = new PublicKey(valueTokenAddress);

    const NUM_DROPS_PER_TX = 4;
    const TX_INTERVAL = 1000;

    async function generateTransactions(batchSize: number, dropList: any) {
      let result = [];

      const payerPublicKey = publicKey;

      const payerTokenAccount = await getAssociatedTokenAddress(
        mint,
        payerPublicKey
      );

      const payerAccountInfo = await connection.getAccountInfo(
        payerTokenAccount
      );

      // Token
      let txInstructions = dropList.map((drop: any) => {
        const takerTokenAccount = new PublicKey(drop.walletAddress);

        if (!payerAccountInfo || !payerAccountInfo.data) {
          createAssociatedTokenAccountInstruction(
            payerPublicKey,
            payerTokenAccount,
            payerPublicKey,
            mint // mint
          );
        }
        return createTransferInstruction(
          payerTokenAccount,
          takerTokenAccount,
          payerPublicKey,
          Number(drop.amount) * 10 ** 6,
          [],
          TOKEN_PROGRAM_ID // programId
        );
      });
      const numTransactions = Math.ceil(txInstructions.length / batchSize);
      for (let i = 0; i < numTransactions; i++) {
        let bulkTransaction = new Transaction();

        let lowerIndex = i * batchSize;
        let upperIndex = (i + 1) * batchSize;
        for (let j = lowerIndex; j < upperIndex; j++) {
          if (txInstructions[j]) bulkTransaction.add(txInstructions[j]);
        }
        bulkTransaction.feePayer = publicKey;
        bulkTransaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;

        result.push(bulkTransaction);
      }

      console.log("building transactions ...");
      return result;
    }

    async function executeTransactions(
      transactionList: Transaction[]
    ): Promise<any> {
      let staggeredTransactions = transactionList.map(
        (transaction: Transaction, i: number) => {
          return new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                const signature = await sendTransaction(
                  transaction,
                  connection
                );

                let txSuccess = false;
                while (!txSuccess) {
                  const {
                    value: txStatus,
                  } = await connection.getSignatureStatus(signature);

                  if (
                    txStatus &&
                    (txStatus.confirmationStatus === "confirmed" ||
                      txStatus.confirmationStatus === "finalized")
                  ) {
                    txSuccess = true;
                    resolve({ signature: signature });
                    break;
                  } else {
                    resolve({ status: { state: "rejected, funds returned" } });
                    break;
                  }
                }
              } catch (error) {
                console.log("Transaction error", error);

                reject(error);
              }
            }, i * TX_INTERVAL);
          });
        }
      );
      let result = await Promise.all(staggeredTransactions);
      return result[0];
    }

    async function transfer(amount: number) {
      const dropList = [
        {
          // walletAddress: this.USDCxJobsFeeWalletAddress,
          walletAddress: "5U26mFyHX2HWbwf7bEKkYdTTz2qKf9sdZFm46hXPvEhS",
          amount: (amount * 0.02).toFixed(6),
        },
        {
          // walletAddress: this.USDCxJobsVaultAddress,
          walletAddress: "GyWaQDZ18EqLdkVFEFDq9MfeRKxB8VN5omHmQxPTj7BW",
          amount: (amount * 0.98).toFixed(6),
        },
      ];
      console.log(`Initiating $$$ transfer from ${publicKey.toString()}`);
      const transactionList = await generateTransactions(
        NUM_DROPS_PER_TX,
        dropList
      );
      console.log("done building transactions ...");
      const txResults = await executeTransactions(transactionList);
      return txResults.status;
    }

    return { transfer };
  }
}
