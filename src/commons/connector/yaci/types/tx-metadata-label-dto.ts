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
 * @interface TxMetadataLabelDto
 */
export interface TxMetadataLabelDto {
  /**
   * @type {number}
   * @memberof TxMetadataLabelDto
   */
  blockNumber?: number;

  /**
   * @type {number}
   * @memberof TxMetadataLabelDto
   */
  blockTime?: number;

  /**
   * @type {string}
   * @memberof TxMetadataLabelDto
   */
  label?: string;

  /**
   * @type {JsonNode}
   * @memberof TxMetadataLabelDto
   */
  body?: JsonNode;

  /**
   * @type {JsonNode}
   * @memberof TxMetadataLabelDto
   */
  jsonMetadata?: JsonNode;

  /**
   * @type {number}
   * @memberof TxMetadataLabelDto
   */
  slot?: number;
}