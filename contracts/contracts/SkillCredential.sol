// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SkillCredential {
    address public issuer;

    mapping(bytes32 => bool) private credentialHashes;

    constructor(address _issuer) {
        issuer = _issuer;
    }

    function storeCredentialHash(bytes32 hash) external {
        require(msg.sender == issuer, "Not issuer");
        credentialHashes[hash] = true;
    }

    function verifyCredential(bytes32 hash) external view returns (bool) {
        return credentialHashes[hash];
    }
}