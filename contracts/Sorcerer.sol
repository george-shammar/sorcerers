// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.23;

import "https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";

contract Sorcerer is ERC721 {
    uint256 public currentTokenId;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    struct Sorcer {
        uint256 id;
        uint256 season;
    }

    Sorcer[] public sorcerers;
    event NewSorcerer(address indexed owner, uint256 id, uint256 season);

    function mintTo(address recipient) public returns (uint256) {
        uint256 newItemId = ++currentTokenId;
        Sorcer memory newSorcerer = Sorcer(newItemId, 1);
        sorcerers.push(newSorcerer);
        _safeMint(recipient, newItemId);
        emit NewSorcerer(recipient, newItemId, 1);
        return newItemId;
    }

     // Getters
    function getSorcerers() public view returns (Sorcer[] memory) {
        return sorcerers;
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        return Strings.toString(id);
    }

    function getOwnerSorcerers(address _owner) public view returns (Sorcer[] memory) {
        Sorcer[] memory result = new Sorcer[](balanceOf(_owner));
        uint256 counter = 0;
        for (uint256 i = 0; i < sorcerers.length; i++) {
            if (ownerOf(sorcerers[i].id) == _owner) {
                result[counter] = sorcerers[i];
                counter++;
            }
        }
        return result;
    }
}

// Sorcerer, SOC