/* tslint:disable */
/* eslint-disable */
/**
 * Yaci Store API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { JsonNode } from "./json-node";
/**
 *
 *
 * @export
 * @interface TxnWitness
 */
export interface TxnWitness {
  /**
   * @type {string}
   * @memberof TxnWitness
   */
  txHash?: string;

  /**
   * @type {number}
   * @memberof TxnWitness
   */
  index?: number;

  /**
   * @type {string}
   * @memberof TxnWitness
   */
  pubKey?: string;

  /**
   * @type {string}
   * @memberof TxnWitness
   */
  signature?: string;

  /**
   * @type {string}
   * @memberof TxnWitness
   */
  pubKeyhash?: string;

  /**
   * @type {string}
   * @memberof TxnWitness
   */
  type?: TxnWitnessTypeEnum;

  /**
   * @type {JsonNode}
   * @memberof TxnWitness
   */
  additionalData?: JsonNode;
}

/**
 * @export
 * @enum {string}
 */
export enum TxnWitnessTypeEnum {
  BOOTSTRAPWITNESS = "BOOTSTRAP_WITNESS",
  VKEYWITNESS = "VKEY_WITNESS",
  BYRONPKWITNESS = "BYRON_PK_WITNESS",
  BYRONREDEEMWITNESS = "BYRON_REDEEM_WITNESS",
  BYRONSCRIPTWITNESS = "BYRON_SCRIPT_WITNESS",
  BYRONUNKNOWNWITNESS = "BYRON_UNKNOWN_WITNESS"
}
