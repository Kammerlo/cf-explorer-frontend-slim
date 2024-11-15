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

import { Relay } from "./relay";
/**
 *
 *
 * @export
 * @interface PoolRegistration
 */
export interface PoolRegistration {
  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  blockNumber?: number;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  blockTime?: number;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  txHash?: string;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  certIndex?: number;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  poolId?: string;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  vrfKeyHash?: string;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  pledge?: number;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  cost?: number;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  margin?: number;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  rewardAccount?: string;

  /**
   * @type {Array<string>}
   * @memberof PoolRegistration
   */
  poolOwners?: Array<string>;

  /**
   * @type {Array<Relay>}
   * @memberof PoolRegistration
   */
  relays?: Array<Relay>;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  metadataUrl?: string;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  metadataHash?: string;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  epoch?: number;

  /**
   * @type {number}
   * @memberof PoolRegistration
   */
  slot?: number;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  blockHash?: string;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  rewardAccountBech32?: string;

  /**
   * @type {string}
   * @memberof PoolRegistration
   */
  poolIdBech32?: string;
}
