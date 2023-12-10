import { Connection, PublicKey } from "@solana/web3.js";
import { config } from "dotenv";
import path from "path";
import gigService from "../gig.service";
import pointsService from "../points.service";
import userService from "../user.service";
import { chainID, chainMetadata } from "./constants";

config({ path: path.resolve(__dirname, "../../../.env") });

export class SPLWeb3 {
  private networkCluster;
  private usdcAddress;
  private connection;
  private XjobsSigner;
  private networkEndpoint;
  private XjobsVault;
  private chain_id;
  private iv: string = process.env.INIT_VECTOR as string;

  constructor(chainId: chainID, network: string) {
    this.chain_id = chainId;
    this.networkCluster = network;
    this.usdcAddress = chainMetadata[chainId].TokenAddresses.USDC;

    this.connection = new Connection(chainMetadata[chainId].rpcUrl);

    this.XjobsSigner = new PublicKey(process.env.EVM_SIGNER as string);

    this.XjobsVault = process.env.MULTI_SIG; // get from env

    this.networkEndpoint =
      this.networkCluster == "mainnet"
        ? process.env.EVM_RPC_PAYMENT_MAINNET
        : process.env.EVM_RPC_PAYMENT_DEVNET;
  }

  private validatePayment = async (transactionHash: string) => {
    // internal function to validate payment
    // based on the transaction hash do stuff.
  };
  private makeSOLPaymentFromMultiSig = async () => {
    // internal function to validate payment
    // based on the transaction hash do stuff.
  };
  private makeUSDCPaymentFromMultiSig = async () => {
    // internal function to validate payment
    // based on the transaction hash do stuff.
  };

  sendUSDC = async () => {
    // respond to the frontend requst for payment
    this.makeUSDCPaymentFromMultiSig;
  };

  sendSOL = async () => {
    // respond to the frontend requst for payment
    this.makeSOLPaymentFromMultiSig;
  };

  receiveUSDC = async () => {
    // respond to the frontend requst for payment
    // validate sent USDC
    // collect fees
    this.validatePayment("");
    // for a user, update its data signifying a verified payment.
    Promise.all([
      userService.updateUserProfile,
      gigService.updateGigDetails,
      pointsService.completingAJob,
    ]);
  };

  receiveSOL = async () => {
    // respond to the frontend requst for payment
    this.validatePayment("");
    Promise.all([
      userService.updateUserProfile,
      gigService.updateGigDetails,
      pointsService.completingAJob,
    ]);
  };

  // @todo add a cron job functionality, to schedule payments for every evening by 7pm
  // @todo add a contant wait time before a user can receive payment after it has been released
  // @todo integrate tatum solami wallet to implement the payment for the escorw. to automate shit up.
  // @todo explore shamir key sharing to split the private key among multiple users.
}
