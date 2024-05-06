// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Leaderboard {
    struct Player {
        uint256 score;
        bool exists;
    }

    mapping(address => Player) public players;
    address[] public rankings;

    event PlayerAdded(address player, uint256 score);
    event RankingsUpdated(address[] newRankings);

    function addPlayer(address _player, uint256 _score) public {
        require(!players[_player].exists, "Player already exists");

        players[_player] = Player(_score, true);
        rankings.push(_player);

        emit PlayerAdded(_player, _score);
        updateRankings();
    }

    function updateRankings() private {
        for (uint256 i = 0; i < rankings.length; i++) {
            for (uint256 j = i + 1; j < rankings.length; j++) {
                if (players[rankings[i]].score < players[rankings[j]].score) {
                    (rankings[i], rankings[j]) = (rankings[j], rankings[i]);
                }
            }
        }

        emit RankingsUpdated(rankings);
    }

    function getRankings() public view returns (address[] memory, uint256[] memory) {
        uint256 length = rankings.length;
        address[] memory addresses = new address[](length);
        uint256[] memory scores = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            addresses[i] = rankings[i];
            scores[i] = players[rankings[i]].score;
        }

        return (addresses, scores);
    }
}
