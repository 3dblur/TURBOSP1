// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SP1Verifier
 * @dev A simple contract for verifying SP1 proofs and storing scores
 * This is a mock implementation for demonstration purposes
 */
contract SP1Verifier {
    // Event emitted when a new score is submitted
    event ScoreSubmitted(address indexed player, uint256 score, bytes proof);
    
    // Mapping to store player scores
    mapping(address => uint256) public playerScores;
    
    /**
     * @dev Submit a score with a proof
     * @param score The player's score
     * @param proof The SP1 proof verifying the score
     * @return success Whether the submission was successful
     */
    function submitScore(uint256 score, bytes calldata proof) external returns (bool success) {
        // In a real implementation, this would verify the proof using SP1's verification algorithm
        // For demonstration purposes, we'll accept all proofs
        
        // Only update the score if it's higher than the player's current score
        if (score > playerScores[msg.sender]) {
            playerScores[msg.sender] = score;
        }
        
        // Emit an event for the submission
        emit ScoreSubmitted(msg.sender, score, proof);
        
        return true;
    }
    
    /**
     * @dev Get a player's highest score
     * @param player The player's address
     * @return score The player's highest score
     */
    function getPlayerScore(address player) external view returns (uint256 score) {
        return playerScores[player];
    }
} 