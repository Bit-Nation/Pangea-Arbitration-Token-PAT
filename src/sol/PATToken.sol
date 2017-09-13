/*
 * PAT Token Smart Contract.  Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.11;

import "./StandardToken.sol";

/**
 * PAT Token Smart Contract.
 */
contract PATToken is StandardToken {
  function PATToken (address _centralBank)
    StandardToken (_centralBank) {
    // Nothing here
  }
}
