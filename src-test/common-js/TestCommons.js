/*
 * Common stuff needed for tests.
 * Copyright © 2016–2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

/**
 * Throws given message unless given condition is true.
 *
 * @param message message to throw unless given condition is true
 * @param condition condition to check
 */
function assert (message, condition) {
  if (!condition) throw message;
}

/**
 * Throws given message unless given actual value is the same as given expected
 * value.
 *
 * @param message message to throw if actual value is not the same as expected
 *        value
 * @param expected expected value
 * @param actual actual value
 */
function assertSame (message, expected, actual) {
  assert (
    message + " (expected: " + expected + ", actual: " + actual + ")",
    expected === actual);
}

/**
 * Throws given message unless given actual value equals to the given expected
 * value.
 *
 * @param message message to throw if actual value is not equal to the
 *        expected value
 * @param expected expected value
 * @param actual actual value
 */
function assertEquals (message, expected, actual) {
  assert (
    message + " (expected: " + expected + ", actual: " + actual + ")",
    expected == actual);
}

/**
 * Throws given message unless given actual value equals to the given expected
 * value after both values are converted to big numbers.
 *
 * @param message message to throw if actual value is not equal to the expected
 *        value after converting both values to big numbers
 * @param expected expected value
 * @param actual actual value
 */
function assertBNEquals (message, expected, actual) {
  assert (
    message + " (expected: " + expected + ", actual: " + actual + ")",
    web3.toBigNumber(expected).eq (web3.toBigNumber (actual)));
}

/**
 * Throws given message unless balance of given address equals to given
 * expected balance.
 *
 * @param message message message to throw is balance of given address is not
 *        equal to given expected balance
 * @param expected expected balance in given units
 * @param unit expected balance unit, i.e. "wei"
 * @param address address to check balance of
 */
function assertBalance (message, expected, unit, address) {
  assertBNEquals (
    message + " balance",
    web3.toWei (expected, unit),
    web3.eth.getBalance (address));
}

/**
 * Throws given message unless there is contract deployed at given address.
 *
 * @param message message to throw is there is no contract deployed at given
 *        address
 * @param address address to check contract deployed at
 */
function assertContract (message, address) {
  assert (
    message + " contract not deployed",
    web3.eth.getCode (address).length > 2);
}

/**
 * Throws given message unless given events were logged by given smart contract
 * in given transaction.
 *
 * @param message message to be logged if given events were not logged by given
 *        smart contract in given transaction
 * @param contract smart contract to check events from
 * @param event event to check
 * @param transaction transaction to check events in
 */
function assertEvents (message, contract, event, transaction) {
  var blockNumber = web3.eth.getTransactionReceipt (transaction).blockNumber;
  var blockEvents = event.call (
          contract,
          {},
          {
            fromBlock: blockNumber,
            toBlock: blockNumber
          }).get ();

  var actualEvents = [];
  for (var i = 0; i < blockEvents.length; i++) {
    var blockEvent = blockEvents [i];
    if (blockEvent.transactionHash == transaction)
      actualEvents.push (blockEvent);
  }

  var expectedEvent;
  var actualEvent;

  var i;
  for (i = 0; i < arguments.length - 4 && i < actualEvents.length; i++) {
    expectedEvent = arguments [i + 4];
    actualEvent = actualEvents [i];
    for (var field in expectedEvent) {
      if (expectedEvent.hasOwnProperty (field)) {
        var expected = expectedEvent [field];
        var actual = actualEvent.args [field];

        if (typeof expected == "object" || typeof actual == "object")
          assertBNEquals (message + " " + field, expected, actual);
        else
          assertEquals (message + " " + field, expected, actual);
      }
    }
  }

  assert (
      message + " missing events: " + (arguments.length - 4 - i),
      arguments.length - 4 == i);

  assert (
      message + " unexpected events: " + (actualEvents.length - i),
      actualEvents.length == i);
}

/**
 * Load ABI of contract with given name and create contract object.
 *
 * @param name name of the contract to load ABI of
 * @return contract object
 */
function loadContract (name) {
  loadScript (
    "target/test-solc-js/" + name + ".abi.js");
  return web3.eth.contract (_);
}

/**
 * Load byte code of contract with given name.
 *
 * @param name name of the contract to load byte code of
 * @return contract byte code
 */
function loadContractCode (name) {
  loadScript (
    "target/test-solc-js/" + name + ".bin.js");
  return _;
}

/**
 * Get contract deployed by given transaction.
 *
 * @param message message to throw if given transaction didn't deploy contract
 * @param contract contract type to get
 * @param transaction transaction to get contract deployed by
 * @return contract deployed by given transaction
 */
function getDeployedContract (message, contract, transaction) {
  var contractAddress =
    web3.eth.getTransactionReceipt (transaction).contractAddress;

  assert (message + " contract address", contractAddress);
  assertContract (message, contractAddress);

  return contract.at (contractAddress);
}

/**
 * Tests to run.
 */
var tests = [];
