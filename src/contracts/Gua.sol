// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
import "@0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "./CBC.sol";

contract Gua is NFTokenMetadata, Ownable {
    CBC public token;

    uint  public tokenId;
    address public receiverAddress;

    event MintToken(address owner, uint tokenId, string uri,uint value);
    event ChangeReceiverAddress(address from, address to);

    constructor(CBC currToken_) public {
        token = currToken_;
        receiverAddress=0xc16689b9a55ACdB244a77726f7248f2B7069E80c;
        nftName = "Gua NFT";
        nftSymbol = "GUA";
        tokenId = 0;
    }

    function changeReceiverAddress(address newAddress) external onlyOwner
    {
        emit ChangeReceiverAddress(receiverAddress,newAddress);
        receiverAddress=newAddress;
    }

    function mint(string calldata _uri,uint value) external onlyOwner {
        token.transferFrom(msg.sender,receiverAddress,value);
        super._mint(msg.sender, tokenId);
        super._setTokenUri(tokenId, _uri);
        tokenId = tokenId + 1;
        emit MintToken(msg.sender, tokenId, _uri,value);
    }
}