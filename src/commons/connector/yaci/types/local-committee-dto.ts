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

import { LocalCommitteeMemberDto } from "./local-committee-member-dto";
/**
 *
 *
 * @export
 * @interface LocalCommitteeDto
 */
export interface LocalCommitteeDto {
  /**
   * @type {number}
   * @memberof LocalCommitteeDto
   */
  threshold?: number;

  /**
   * @type {Array<LocalCommitteeMemberDto>}
   * @memberof LocalCommitteeDto
   */
  members?: Array<LocalCommitteeMemberDto>;
}
