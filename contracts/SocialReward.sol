// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SorcererToken.sol";

contract SocialReward is ERC721URIStorage, Ownable {
    SorcererToken public token;

    mapping(address => uint256[]) private ownedNFTs;
    mapping(address => uint256) public rewardsReceived;

    struct NFT {
        string username;
        string avatar;
    }

    mapping(uint256 => NFT) public nfts;
    uint256 private nextTokenId = 1;

    constructor(SorcererToken _token) ERC721("SocererRewardNFT", "SRNFT") Ownable(msg.sender){
        token = _token;
    }

    function mintNFT(address to, string memory username, string memory avatar, string memory tokenURI) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nfts[tokenId] = NFT(username, avatar);
        ownedNFTs[to].push(tokenId);
        return tokenId;
    }

    function getOwnedNFTs(address owner) external view returns (uint256[] memory) {
        return ownedNFTs[owner];
    }

    function distributeRewards(address[] memory recipients, address postCreator, uint256 totalReward) external {
        require(recipients.length > 0, "No recipients provided");
        require(totalReward > 0, "Total reward must be greater than zero");

        uint256 creatorReward = (totalReward * 637) / 1000;
        uint256 individualReward = (totalReward - creatorReward) / recipients.length;

        token.transfer(postCreator, creatorReward);

        for (uint256 i = 0; i < recipients.length; i++) {
            token.transfer(recipients[i], individualReward);
            rewardsReceived[recipients[i]] += individualReward;
        }
    }

    function getTotalRewardReceived(address recipient) external view returns (uint256) {
        return rewardsReceived[recipient];
    }
}
