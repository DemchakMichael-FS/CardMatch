/**
 * Card class representing a single card in the game
 */
export class Card {
    private element: HTMLElement;
    private value: number;
    private isFlipped: boolean = false;
    private isMatched: boolean = false;

    /**
     * Constructor for the Card class
     * @param element The HTML element representing the card
     * @param value The value of the card (used for matching)
     */
    constructor(element: HTMLElement, value: number) {
        this.element = element;
        this.value = value;
        this.render();
    }

    /**
     * Get the value of the card
     * @returns The card's value
     */
    getValue(): number {
        return this.value;
    }

    /**
     * Check if the card is currently flipped
     * @returns True if the card is flipped, false otherwise
     */
    getIsFlipped(): boolean {
        return this.isFlipped;
    }

    /**
     * Check if the card has been matched
     * @returns True if the card is matched, false otherwise
     */
    getIsMatched(): boolean {
        return this.isMatched;
    }

    /**
     * Flip the card
     */
    flip(): void {
        if (!this.isMatched) {
            this.isFlipped = !this.isFlipped;
            this.element.classList.toggle('flipped', this.isFlipped);
        }
    }

    /**
     * Mark the card as matched
     */
    setMatched(): void {
        this.isMatched = true;
        this.element.classList.add('matched');
    }

    /**
     * Reset the card to its initial state
     */
    reset(): void {
        this.isFlipped = false;
        this.isMatched = false;
        this.element.classList.remove('flipped', 'matched');
    }

    /**
     * Render the card's value on the back face
     */
    private render(): void {
        const backFace = this.element.querySelector('.card-back');
        if (backFace) {
            backFace.textContent = this.value.toString();
        }
    }
}
