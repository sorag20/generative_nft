// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

contract GenerativeOnchainNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    constructor() ERC721("Generative Onchain NFT", "GONFT") {}

    function mint(address recipient) public onlyOwner returns(uint256) {
        uint tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(recipient,tokenId);
        return tokenId;
    }
function tokenURI(uint256 _tokenId) public view override(ERC721) returns (string memory) {
    require(
     _exists(_tokenId),
     "ERC721Metadata: URI query for nonexistent token"
   );
    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            bytes(
              abi.encodePacked(
                  '{"name":"', "Generative NFT",
                '", "description":"', "This is Generative NFT",
                '", "image":"', "ipfs://QmTKcB2mVYpGKhfFobiaqfPWeRXghbPd4j6Y9Z9G7zCtAd/1.png",
                '"}'
                )
              )
            )
          )
        );
}

}


