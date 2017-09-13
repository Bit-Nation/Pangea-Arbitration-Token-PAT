/*
 * Simple Wallet Contract to be used for testing.
 * Copyright © 2016–2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.11;

contract Wallet {
  /**
   * Whether wallet accepts incoming payments.
   */
  bool acceptsPayments = false;

  /**
   * Default function just accepts payments.
   */
  function () payable {
    if (!acceptsPayments) throw;
  }

  /**
   * Set whether wallet accepts payments.
   *
   * @param _acceptsPayments true to accept payments, false to refuse payments.
   */
  function setAcceptsPayments (bool _acceptsPayments) {
    acceptsPayments = _acceptsPayments;
  }

  /**
   * Execute transaction to given address with given data and value.
   *
   * @param _to address to execute transaction to
   * @param _data transaction data
   * @param _value transaction value
   * @return true if transaction was executed successfully, false otherwise 
   */
  function execute (address _to, bytes _data, uint256 _value)
  payable
  returns (bool success) {
    bool result = _to.call.value (_value)(_data);
    Result (result);
    return result;
  }

  /**
   * Holds result of operation.
   *
   * @param _value result of operation
   */
  event Result (bool _value);
}
