// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Sorcerer is ERC721 {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    uint256 COUNTER;

    uint256 private _price = 1200000000000000;

    struct Sorcer {
        string name;
        uint256 id;
        uint256 level;
    }

    Sorcer[] public sorcerers;

    event NewSorcerer(address indexed owner, uint256 id, string name, uint256 level);

    // Creation
    function _createSorcerer(string memory _name, address _owner) internal {
        Sorcer memory newSorcerer = Sorcer(_name, COUNTER, 1);
        sorcerers.push(newSorcerer);
        _safeMint(_owner, COUNTER);
        // _setTokenURI(COUNTER, tokenURI);
        emit NewSorcerer(_owner, COUNTER, _name, 1);
        COUNTER++;
    }

    function createSorcerer(string memory _name) public {
        _createSorcerer(_name, msg.sender);
    }

    // Getters
    function getSorcerers() public view returns (Sorcer[] memory) {
        return sorcerers;
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