// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Forum is ERC20 {
    address public owner;
    uint256 public postReward;
    mapping(address => uint256) public postCreators;
    mapping(address => uint256) public postCommenters;
    mapping(address => bool) public isCommented;

    event PostCreated(address indexed creator, uint256 reward);
    event PostCommented(address indexed commenter, uint256 reward);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply);
        owner = msg.sender;
        postReward = 1; // Initial reward for creating a post
    }

    function createPost() external {
        require(balanceOf(msg.sender) >= postReward, "Insufficient balance to create post");
        _transfer(msg.sender, owner, postReward / 2); // Half reward to the creator
        emit PostCreated(msg.sender, postReward / 2);
        postCreators[msg.sender] += postReward / 2;
    }

    function commentOnPost(address _postOwner) external {
        require(balanceOf(msg.sender) >= 1, "Insufficient balance to comment");
        require(!isCommented[msg.sender], "Already commented on this post");

        _transfer(msg.sender, owner, 1); // Reward for commenting
        emit PostCommented(msg.sender, 1);

        uint256 rewardForCommenter = postReward / 2 / (postCreators[_postOwner] + 1); // Calculate reward for commenter
        postCreators[_postOwner] += rewardForCommenter; // Reward for the post creator
        postCommenters[msg.sender] += rewardForCommenter; // Reward for the commenter
        isCommented[msg.sender] = true;
    }
}
