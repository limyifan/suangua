// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract CBC {

    string public constant name = "Charles Bank Currency";
    string public constant symbol = "CBC";
    uint8 public constant decimals = 18;


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event MinterChanged(address indexed from, address to);



    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    address public minter;

    using SafeMath for uint256;


    constructor() public {
        minter = msg.sender;
    }

    function passMinterRole(address newMinter) public returns (bool) {
        require(msg.sender == minter, 'Error, only owner can change pass minter role');
        minter = newMinter;
        emit MinterChanged(msg.sender, minter);
        return true;
    }

    function mint(uint256 amount) public {
        address receiver=msg.sender;
        require(receiver == minter, 'Error, msg.sender does not have minter role');
        balances[receiver] = balances[receiver].add(amount);
    }

    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public payable returns (bool)  {
        require(numTokens <= balances[msg.sender],"Not Enough Balance");
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint numTokens) public payable returns (bool) {
        require(numTokens <= balances[owner],"Owner balance is not enough");
        require(numTokens <= allowed[owner][buyer],"Owner allowed balance is not enough");
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][buyer] = allowed[owner][buyer].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}