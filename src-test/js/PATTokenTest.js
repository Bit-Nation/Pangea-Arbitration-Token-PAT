/*
 * Test for PAT Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "PATToken",
  steps: [
    { name: "Ensure there is at least one account: Alice",
      body: function (test) {
        while (!web3.eth.accounts || web3.eth.accounts.length < 1)
          personal.newAccount ("");

        test.alice = web3.eth.accounts [0];
      }},
    { name: "Ensure Alice has at least 5 ETH",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getBalance (test.alice).gte (web3.toWei ("5", "ether"));
      },
      body: function (test) {
        miner.stop ();
      }},
    { name: "Alice deploys PATToken smart contract with alice as central bank",
      body: function (test) {
        test.patTokenContract = loadContract ("PATToken");
        var patTokenCode = loadContractCode ("PATToken");

        personal.unlockAccount (test.alice, "");
        test.tx = test.patTokenContract.new (
          test.alice,
          {from: test.alice, data: patTokenCode, gas: 1000000}).
          transactionHash;
      }},
    { name: "Make sure contracts were deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        test.patToken = getDeployedContract (
          "PATToken",
          test.patTokenContract,
          test.tx);
      }}
  ]});
