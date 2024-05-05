// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Leaderboard {
  mapping (address => Player) public players;
  address[] public rankings;
  address[] playerAddresses;

  struct Player {
    uint256 score;
  }

  function addPlayer(address _player, uint256 _score) public {
    players[_player].score = _score;
    updateRankings();
  }

  function removePlayer(address _player) public {
    delete players[_player];
    updateRankings();
  }

  function updateScore(address _player, uint256 _score) public {
    players[_player].score = _score;
    updateRankings();
  }

  function bubbleSortDescending(uint256[] memory arr) private pure {
    uint256 n = arr.length;
    for (uint256 i = 0; i < n - 1; i++) {
        for (uint256 j = 0; j < n - i - 1; j++) {
            if (arr[j] < arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                uint256 temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
  }

  function updateRankings() private {
    uint256[] memory scores = new uint256[](playerAddresses.length);
    uint256 i = 0;
    for (uint256 j = 0; j < playerAddresses.length; j++) {
        address player = playerAddresses[j];
        scores[i] = players[player].score;
        i++;
    }
    bubbleSortDescending(scores);
    i = 0;
    for (uint256 k = 0; k < scores.length; k++) {
        uint256 score = scores[k];
        for (uint256 l = 0; l < playerAddresses.length; l++) {
            address player = playerAddresses[l];
            if (players[player].score == score) {
                rankings[i] = player;
                i++;
            }
        }
    }
  }

  function greaterThan(uint256 a, uint256 b) private pure returns (bool) {
    return a > b;
  }
}