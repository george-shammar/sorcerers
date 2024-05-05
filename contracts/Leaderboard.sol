// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Leaderboard {
  mapping (address => Player) public players;

  struct Player {
    uint256 score;
  }
}