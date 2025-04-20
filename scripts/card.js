/**
 * Card class representing a single card in the game
 */
class Card {
    /**
     * Constructor for the Card class
     * @param element The HTML element representing the card
     * @param value The value of the card (used for matching)
     */
    constructor(element, value) {
        this.isFlipped = false;
        this.isMatched = false;
        this.element = element;
        this.value = value;
        this.render();
    }
    /**
     * Get the value of the card
     * @returns The card's value
     */
    getValue() {
        return this.value;
    }
    /**
     * Check if the card is currently flipped
     * @returns True if the card is flipped, false otherwise
     */
    getIsFlipped() {
        return this.isFlipped;
    }
    /**
     * Check if the card has been matched
     * @returns True if the card is matched, false otherwise
     */
    getIsMatched() {
        return this.isMatched;
    }
    /**
     * Flip the card
     */
    flip() {
        if (!this.isMatched) {
            this.isFlipped = !this.isFlipped;
            this.element.classList.toggle('flipped', this.isFlipped);
        }
    }
    /**
     * Mark the card as matched
     */
    setMatched() {
        this.isMatched = true;
        this.element.classList.add('matched');
    }
    /**
     * Reset the card to its initial state
     */
    reset() {
        this.isFlipped = false;
        this.isMatched = false;
        this.element.classList.remove('flipped', 'matched');
    }
    /**
     * Render the card's value on the back face
     */
    render() {
        const backFace = this.element.querySelector('.card-back');
        if (backFace) {
            backFace.textContent = this.value.toString();
        }
    }
}
