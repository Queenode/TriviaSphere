// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TriviaSphereBadge is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping from tokenId to milestone level (5, 10, 15)
    mapping(uint256 => uint8) public milestoneLevels;

    // Mapping to track if a user has claimed a specific milestone to prevent farming
    mapping(address => mapping(uint8 => bool)) public hasClaimedMilestone;

    event BadgeMinted(address indexed player, uint256 indexed tokenId, uint8 milestoneLevel);

    constructor() ERC721("TriviaSphere Badge", "TRIVIA") Ownable(msg.sender) {}

    /**
     * @dev Mints a milestone badge. In a production app, this would require a signature 
     * from a trusted backend to prevent anyone from just calling the function.
     * For a hackathon "Proof of Ship" with no backend, we allow players to claim,
     * but we prevent claiming the same milestone twice.
     */
    function mintBadge(uint8 milestoneLevel) public {
        require(
            milestoneLevel == 5 || milestoneLevel == 10 || milestoneLevel == 15,
            "Invalid milestone level"
        );
        require(!hasClaimedMilestone[msg.sender][milestoneLevel], "Already claimed this milestone");

        uint256 tokenId = _nextTokenId++;
        milestoneLevels[tokenId] = milestoneLevel;
        hasClaimedMilestone[msg.sender][milestoneLevel] = true;

        _safeMint(msg.sender, tokenId);

        emit BadgeMinted(msg.sender, tokenId, milestoneLevel);
    }

    /**
     * @dev Make tokens Soulbound (non-transferable). 
     * We override _update to prevent transfers.
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) but prevent transferring
        require(from == address(0) || to == address(0), "TriviaSphere Badges are Soulbound and cannot be transferred.");
        return super._update(to, tokenId, auth);
    }

    // Optional: Return a tokenURI based on milestone level
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        uint8 level = milestoneLevels[tokenId];
        
        if (level == 5) return "ipfs://bronze-badge-metadata-uri";
        if (level == 10) return "ipfs://silver-badge-metadata-uri";
        if (level == 15) return "ipfs://gold-badge-metadata-uri";

        return super.tokenURI(tokenId);
    }
}
