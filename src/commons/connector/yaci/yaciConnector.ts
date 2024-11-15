import axios, { AxiosInstance } from "axios";

import { ApiConnector, StakeAddressAction } from "../ApiConnector";
import { ApiReturnType } from "../types/APIReturnType";
import { TRANSACTION_STATUS } from "../../utils/constants";
import {
  AddressBalanceDto,
  BlockDto,
  BlocksPage,
  Delegation,
  Epoch,
  EpochsPage,
  StakeAccountInfo,
  StakeRegistrationDetail,
  TransactionDetails,
  TransactionPage,
  TransactionSummary,
  TxMetadataLabelDto
} from "./types";
import {
  epochToIEpochData,
  mapBlockDTOToBlock,
  mapTxDetailsToTxSummary,
  mapTxUtxoToCollateralResponse,
  mapTxUtxoToUtxo
} from "./mapper/Mapper";
import applyCaseMiddleware from "axios-case-converter";
import { FunctionEnum } from "../types/FunctionEnum";
import { credentialToRewardAddress, Network, paymentCredentialOf } from "@lucid-evolution/lucid";

export class YaciConnector implements ApiConnector {
  baseUrl: string;
  client: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.client = applyCaseMiddleware(axios.create());
  }

  getSupportedFunctions(): FunctionEnum[] {
    return [
      FunctionEnum.EPOCH,
      FunctionEnum.BLOCK,
      FunctionEnum.TRANSACTION,
      FunctionEnum.ADDRESS,
      FunctionEnum.STAKE_ADDRESS_REGISTRATION
    ];
  }

  async getBlocksPage(): Promise<ApiReturnType<Block[]>> {
    const response = await this.client.get<BlocksPage>(`${this.baseUrl}/blocks`);
    const blocks: Block[] = [];
    // getting additional data
    for (const block of response.data.blocks!) {
      blocks.push((await this.getBlockDetail(block.number!)).data as Block);
    }
    return {
      data: blocks,
      total: response.data.total,
      totalPage: response.data.totalPages,
      lastUpdated: Date.now()
    } as ApiReturnType<Block[]>;
  }

  async getBlocksByEpoch(epoch: number): Promise<ApiReturnType<Block[]>> {
    const response = await this.client.get<BlocksPage>(`${this.baseUrl}/blocks/epoch/${epoch}`);
    const blocks: Block[] = [];
    // getting additional data
    for (const block of response.data.blocks!) {
      blocks.push((await this.getBlockDetail(block.number!)).data as Block);
    }
    return {
      data: blocks,
      total: response.data.total,
      totalPage: response.data.totalPages,
      lastUpdated: Date.now()
    } as ApiReturnType<Block[]>;
  }

  async getBlockDetail(blockId: number | string): Promise<ApiReturnType<Block>> {
    if (!blockId) {
      return {
        data: null,
        lastUpdated: Date.now()
      } as ApiReturnType<Block>;
    }
    const response = await this.client.get<BlockDto>(`${this.baseUrl}/blocks/${blockId}`);
    const block: Block = mapBlockDTOToBlock(response.data);
    return {
      data: block,
      lastUpdated: Date.now()
    } as ApiReturnType<Block>;
  }

  async getTxDetail(txHash: string): Promise<ApiReturnType<TransactionDetail>> {
    const response = await this.client.get<TransactionDetails>(`${this.baseUrl}/txs/${txHash}`);
    const txDetails = response.data;
    const blockResponse = await this.getBlockDetail(txDetails.blockHeight!);
    const block = blockResponse.data;
    const metadataResponse = await this.client.get<TxMetadataLabelDto[]>(`${this.baseUrl}/txs/${txHash}/metadata`);
    const metadata = metadataResponse.data;
    const tx: TransactionDetail = {
      tx: {
        hash: txDetails.hash!,
        time: block ? block.time : "",
        blockNo: block ? block.blockNo : 0,
        epochSlot: block ? block.epochSlotNo : 0,
        epochNo: block ? block.epochNo : 0,
        status: txDetails.invalid ? TRANSACTION_STATUS.FAILED : TRANSACTION_STATUS.SUCCESS,
        confirmation: 0, // TODO: need to implement
        fee: txDetails.fees || 0,
        totalOutput: txDetails.totalOutput || 0,
        maxEpochSlot: 0, // TODO: need to implement
        slotNo: block ? block.slotNo : 0
      },
      utxOs: {
        inputs: txDetails.inputs!.map((input) => {
          return mapTxUtxoToUtxo(input);
        }),
        outputs: response.data.outputs!.map((output) => {
          return mapTxUtxoToUtxo(output);
        })
      },
      // TODO will add later, when needed
      collaterals: {
        collateralInputResponses: txDetails.collateralInputs
          ? txDetails.collateralInputs.map((input) => {
              return mapTxUtxoToCollateralResponse(input);
            })
          : [],
        collateralOutputResponses: [] // TODO: need to implement
      },
      summary: {
        stakeAddress: mapTxDetailsToTxSummary(txDetails)
      },
      // signersInformation: mapToSignersInformation(txDetails), // TODO requiredSigners is not available in response
      metadata: metadata.map((meta) => {
        return {
          label: meta.label ? +meta.label : 0,
          value: meta.jsonMetadata?.toString() || ""
        };
      }),
      metadataHash: "" // TODO
    };
    return {
      data: tx,
      lastUpdated: Date.now()
    } as ApiReturnType<TransactionDetail>;
  }

  async getTxList(blockId: number | string): Promise<ApiReturnType<TransactionDetail[]>> {
    const response = await this.client.get<TransactionSummary[]>(`${this.baseUrl}/blocks/${blockId}/txs`);
    const txs: TransactionDetail[] = [];
    for (const tx of response.data) {
      // get transaction detail
      txs.push((await this.getTxDetail(tx.txHash!)).data as TransactionDetail);
    }
    return {
      data: txs,
      total: txs.length,
      totalPage: 1, // TODO
      currentPage: 1, // TODO
      lastUpdated: Date.now()
    } as ApiReturnType<TransactionDetail[]>;
  }

  async getTransactions(blockId: number | string | undefined): Promise<ApiReturnType<Transaction[]>> {
    let transactionSummaries: TransactionSummary[] = [];
    if (blockId) {
      const response = await this.client.get<TransactionSummary[]>(`${this.baseUrl}/blocks/${blockId}/txs`);
      transactionSummaries = response.data;
    } else {
      const txsResponse = await this.client.get<TransactionPage>(`${this.baseUrl}/txs`);
      transactionSummaries = txsResponse.data.transactionSummaries!;
    }
    const transactions: Transaction[] = [];
    for (const txSummary of transactionSummaries) {
      const block = await this.getBlockDetail(txSummary.blockNumber!);
      const tx: Transaction = {
        hash: txSummary.txHash || "",
        time: block.data?.time || "", // TODO: need to implement
        blockNo: txSummary.blockNumber || 0,
        blockHash: block.data?.hash || "", // TODO: need to implement
        fee: txSummary.fee || 0,
        epochNo: block.data?.epochNo || 0, // TODO: need to implement
        epochSlotNo: block.data?.epochSlotNo || 0, // TODO: need to implement
        slot: block.data?.slotNo || 0, // TODO: need to implement
        totalOutput: txSummary.totalOutput || 0,
        addressesOutput: txSummary.outputAddresses || [],
        addressesInput: [],
        balance: 0,
        tokens: [] // TODO: need to implement
      };
      transactions.push(tx);
    }
    return {
      data: transactions,
      lastUpdated: Date.now()
    } as ApiReturnType<Transaction[]>;
  }

  async getWalletStakeFromAddress(address: string): Promise<ApiReturnType<WalletStake>> {
    let stake: StakeAccountInfo;
    try {
      const stakeResponse = await this.client.get<StakeAccountInfo>(`${this.baseUrl}/accounts/${address}`);
      stake = stakeResponse.data;
      return {
        data: {
          stakeAddress: stake.stakeAddress || "",
          totalStake: stake.controlledAmount || 0,
          rewardAvailable: stake.withdrawableAmount || 0,
          rewardWithdrawn: 0, // TODO
          status: "ACTIVE", // TODO
          pool: {
            poolId: stake.poolId || "",
            poolName: "",
            tickerName: ""
          }
        },
        error: null,
        lastUpdated: Date.now()
      };
    } catch (e) {
      console.error("Error fetching stakeAddressInfo");
    }
    return {
      data: null,
      error: "Couldn't fetch stakeAddressInfo",
      lastUpdated: Date.now()
    } as ApiReturnType<WalletStake>;
  }

  async getWalletAddressFromAddress(address: string): Promise<ApiReturnType<WalletAddress>> {
    if (address.startsWith("addr")) {
      const addressBalanceResponse = await this.client.get<AddressBalanceDto>(
        `${this.baseUrl}/addresses/${address}/balance`
      );
      const credential = paymentCredentialOf(address);
      const network: Network = process.env.REACT_APP_NETWORK as Network;
      const stakeAddress = credentialToRewardAddress(network, credential); // TODO need to implement to get the right network
      const addressBalance = addressBalanceResponse.data;

      const walletAddress: WalletAddress = {
        address: addressBalance?.address || "",
        stakeAddress: stakeAddress,
        balance: addressBalance?.amounts
          ? addressBalance.amounts
              .map((amt) => {
                return amt.unit === "lovelace" ? +amt.quantity! : 0;
              })
              .reduce((a, b) => a + b, 0)
          : 0,
        tokens: addressBalance.amounts
          ?.filter((amt) => amt.assetName !== "lovelace")
          .map((token) => {
            return {
              address: address,
              name: token.assetName || "",
              displayName: token.assetName || "",
              fingerprint: token.assetName || "",
              quantity: token.quantity || 0
            };
          })
      };
      return {
        data: walletAddress,
        lastUpdated: Date.now()
      } as ApiReturnType<WalletAddress>;
    }
    return {
      data: null,
      error: "Invalid address",
      lastUpdated: Date.now()
    } as ApiReturnType<WalletAddress>;
  }

  async getEpochs(): Promise<ApiReturnType<IDataEpoch[]>> {
    const response = await this.client.get<EpochsPage>(`${this.baseUrl}/epochs`);

    const epochs: IDataEpoch[] = response.data.epochs!.map((epoch) => {
      return epochToIEpochData(epoch);
    });
    return {
      data: epochs,
      totalPage: response.data.totalPages || 0,
      total: response.data.total || 0,
      lastUpdated: Date.now()
    } as ApiReturnType<IDataEpoch[]>;
  }

  async getEpoch(epochId: number): Promise<ApiReturnType<IDataEpoch>> {
    const response = await this.client.get<Epoch>(`${this.baseUrl}/epochs/${epochId}`);
    return {
      data: epochToIEpochData(response.data),
      lastUpdated: Date.now()
    } as ApiReturnType<IDataEpoch>;
  }

  async getStakeAddressRegistrations(stakeAddressAction: StakeAddressAction): Promise<ApiReturnType<IStakeKey[]>> {
    let stakeRegistrationDetails: StakeRegistrationDetail[] = [];
    if (stakeAddressAction === StakeAddressAction.REGISTRATION) {
      const response = await this.client.get<StakeRegistrationDetail[]>(`${this.baseUrl}/stake/registrations`);
      stakeRegistrationDetails = response.data;
    } else if (stakeAddressAction === StakeAddressAction.DEREGISTRATION) {
      const response = await this.client.get<StakeRegistrationDetail[]>(`${this.baseUrl}/stake/deregistrations`);
      stakeRegistrationDetails = response.data;
    } else {
      throw new Error("Invalid StakeAddressAction");
    }
    let iStakeKeys = stakeRegistrationDetails.map((stakeDetail) => {
      return {
        txHash: stakeDetail.txHash || "",
        txTime: stakeDetail.blockTime + "" || "",
        block: stakeDetail.blockNumber || 0,
        epoch: stakeDetail.epoch || 0,
        slotNo: stakeDetail.slot || 0,
        epochSlotNo: stakeDetail.slot || 0, // TODO: need to implement
        stakeKey: stakeDetail.address || ""
      } as IStakeKey;
    });
    return {
      data: iStakeKeys,
      lastUpdated: Date.now()
    } as ApiReturnType<IStakeKey[]>;
  }

  async getStakeDelegations(): Promise<ApiReturnType<IStakeKey[]>> {
    const response = await this.client.get<Delegation[]>(`${this.baseUrl}/stake/delegations`);
    let iStakeKeys = response.data.map((stakeDetail) => {
      return {
        txHash: stakeDetail.txHash || "",
        txTime: stakeDetail.blockTime + "" || "",
        block: stakeDetail.blockNumber || 0,
        epoch: stakeDetail.epoch || 0,
        slotNo: stakeDetail.slot || 0,
        epochSlotNo: stakeDetail.slot || 0, // TODO: need to implement
        stakeKey: stakeDetail.address || "",
        poolName: stakeDetail.poolId || ""
      } as IStakeKey;
    });
    return {
      data: iStakeKeys,
      lastUpdated: Date.now()
    } as ApiReturnType<IStakeKey[]>;
  }
}
