/**
 * Game class handling the card matching game logic
 */
class Game {
    /**
     * Constructor for the Game class
     */
    constructor() {
        this.cards = [];
        this.cardValues = [];
        this.flippedCards = [];
        this.attemptsLeft = 3;
        this.matchedPairs = 0;
        this.isGameOver = false;
        this.totalPairs = 3;
        this.attemptsElement = document.getElementById('attempts-count');
        this.messageElement = document.getElementById('game-message');
        this.restartButton = document.getElementById('restart-btn');
        this.initializeGame();
        this.setupEventListeners();
    }
    /**
     * Initialize the game
     */
    initializeGame() {
        // Generate card values (3 pairs of cards)
        this.generateCardValues();
        // Create card instances
        const cardElements = document.querySelectorAll('.card');
        cardElements.forEach((element, index) => {
            const card = new Card(element, this.cardValues[index]);
            this.cards.push(card);
            // Add click event listener to each card
            element.addEventListener('click', () => this.handleCardClick(card));
        });
        // Update attempts display
        this.updateAttemptsDisplay();
    }
    /**
     * Generate random card values for the game
     */
    generateCardValues() {
        // Create an array of 3 pairs of values
        const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const selectedValues = [];
        // Randomly select 3 values
        for (let i = 0; i < this.totalPairs; i++) {
            const randomIndex = Math.floor(Math.random() * possibleValues.length);
            const value = possibleValues.splice(randomIndex, 1)[0];
            selectedValues.push(value, value); // Add each value twice (for pairs)
        }
        // Shuffle the values
        this.cardValues = this.shuffleArray(selectedValues);
    }
    /**
     * Shuffle an array using the Fisher-Yates algorithm
     * @param array The array to shuffle
     * @returns The shuffled array
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    /**
     * Handle card click events
     * @param card The card that was clicked
     */
    handleCardClick(card) {
        // Ignore clicks if game is over or card is already flipped/matched
        if (this.isGameOver || card.getIsFlipped() || card.getIsMatched()) {
            return;
        }
        // Flip the card
        card.flip();
        // Add to flipped cards array
        this.flippedCards.push(card);
        // Check if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.checkForMatch();
        }
    }
    /**
     * Check if the two flipped cards match
     */
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        // Check if values match
        if (card1.getValue() === card2.getValue()) {
            // Cards match
            card1.setMatched();
            card2.setMatched();
            this.matchedPairs++;
            // Check if all pairs are matched
            if (this.matchedPairs === this.totalPairs) {
                this.endGame(true);
            }
        }
        else {
            // Cards don't match, reduce attempts
            this.attemptsLeft--;
            this.updateAttemptsDisplay();
            // Flip cards back after a delay
            setTimeout(() => {
                card1.flip();
                card2.flip();
            }, 1000);
            // Check if out of attempts
            if (this.attemptsLeft === 0) {
                this.endGame(false);
            }
        }
        // Reset flipped cards array
        this.flippedCards = [];
    }
    /**
     * Update the attempts display
     */
    updateAttemptsDisplay() {
        if (this.attemptsElement) {
            this.attemptsElement.textContent = this.attemptsLeft.toString();
        }
    }
    /**
     * End the game
     * @param isWin Whether the player won or lost
     */
    endGame(isWin) {
        this.isGameOver = true;
        if (this.messageElement) {
            if (isWin) {
                this.messageElement.textContent = 'Congratulations! You found all matches!';
                this.messageElement.className = 'game-message win-message';
            }
            else {
                this.messageElement.textContent = 'Game Over! You ran out of attempts.';
                this.messageElement.className = 'game-message lose-message';
            }
        }
    }
    /**
     * Restart the game
     */
    restart() {
        // Reset game state
        this.flippedCards = [];
        this.attemptsLeft = 3;
        this.matchedPairs = 0;
        this.isGameOver = false;
        // Reset all cards
        this.cards.forEach(card => card.reset());
        // Generate new card values
        this.generateCardValues();
        // Update card values
        this.cards.forEach((card, index) => {
            const cardElement = document.querySelector(`[data-card-index="${index}"]`);
            if (cardElement) {
                const backFace = cardElement.querySelector('.card-back');
                if (backFace) {
                    backFace.textContent = this.cardValues[index].toString();
                }
            }
        });
        // Update attempts display
        this.updateAttemptsDisplay();
        // Clear message
        if (this.messageElement) {
            this.messageElement.textContent = '';
            this.messageElement.className = 'game-message';
        }
    }
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.restart());
        }
    }
}
