// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract GenerativeNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    constructor() ERC721("Generative NFT", "GNFT") {}

    function mint(address recipient,string memory uri) public onlyOwner returns(uint256) {
        uint tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(recipient,tokenId);
        _setTokenURI(tokenId, uri);
        console.log("An NFT w/ ID %s has been minted to %s", tokenId, msg.sender);
        return tokenId;
    }

}


