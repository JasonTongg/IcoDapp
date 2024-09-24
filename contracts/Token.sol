// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Token {
    string public name = "JsnToken";
    string public symbol = "JSN";
    string public standard = "JsnToken v.0.1";
    uint256 public totalSupply;
    uint256 public _userId;

    address public ownerOfContract;
    address[] public holderToken;

    event Transfer (
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => TokenHolderInfo) public tokenHolderInfos;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    struct TokenHolderInfo {
        uint256 _tokenId;
        address _from;
        address _to;
        uint256 _totalToken;
        bool _tokenHolder;
    }

    constructor(uint256 _initialSupply) {
        ownerOfContract = msg.sender;
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function increment() internal {
        _userId++;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        increment();
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        TokenHolderInfo memory newTokenHolderInfo = TokenHolderInfo({
            _tokenId: _userId,
            _from: msg.sender,
            _to: _to,
            _totalToken: balanceOf[_to],
            _tokenHolder: true
        });

        tokenHolderInfos[_to] = newTokenHolderInfo;
        bool check = false;
        for(uint i=0;i<holderToken.length;i++){
            if(holderToken[i] == _to){
                check = true;
            }
        }

        if(check == false){
            holderToken.push(_to);
        }

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function getTokenHolderData(address _address) public view returns(uint256, address, address, uint256, bool) {
        return (
            tokenHolderInfos[_address]._tokenId,
            tokenHolderInfos[_address]._to,
            tokenHolderInfos[_address]._from,
            tokenHolderInfos[_address]._totalToken,
            tokenHolderInfos[_address]._tokenHolder
        );
    }

    function getTokenHolder() public view returns(address[] memory) {
        return holderToken;
    }
}
