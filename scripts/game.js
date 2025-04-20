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
        this.attemptsLeft = 3; // Player has 3 attempts to match all pairs
        this.matchedPairs = 0;
        this.isGameOver = false;
        this.totalPairs = 3; // 3 pairs of matching cards (6 cards total)
        this.isProcessingMatch = false; // Flag to prevent clicking during animation

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
        // Ignore clicks if game is over, card is already flipped/matched, or we're processing a match
        if (this.isGameOver || card.getIsFlipped() || card.getIsMatched() || this.isProcessingMatch) {
            return;
        }
        // Flip the card
        card.flip();
        // Add to flipped cards array
        this.flippedCards.push(card);
        // Check if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.isProcessingMatch = true; // Prevent further clicks during processing
            setTimeout(() => this.checkForMatch(), 500); // Small delay to let player see the cards
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
            // Reset flipped cards array immediately for matches
            this.flippedCards = [];
            this.isProcessingMatch = false;
        }
        else {
            // Cards don't match, reduce attempts
            this.attemptsLeft--;
            this.updateAttemptsDisplay();
            // Flip cards back after a delay
            setTimeout(() => {
                card1.flip();
                card2.flip();

                // Reset flipped cards array after animation
                this.flippedCards = [];
                this.isProcessingMatch = false;

                // Check if out of attempts
                if (this.attemptsLeft === 0) {
                    this.endGame(false);
                }
            }, 1000);
        }
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
        this.isProcessingMatch = false;

        // Reset all cards
        this.cards.forEach(card => card.reset());

        // Generate new card values
        this.generateCardValues();

        // Update card values without adding duplicate event listeners
        const cardElements = document.querySelectorAll('.card');
        this.cards = [];

        // Remove old event listeners by cloning elements
        cardElements.forEach((element, index) => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);

            // Create new card with new value
            const card = new Card(newElement, this.cardValues[index]);
            this.cards.push(card);

            // Add click event listener
            newElement.addEventListener('click', () => this.handleCardClick(card));
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
