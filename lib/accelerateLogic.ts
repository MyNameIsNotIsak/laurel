export interface PlayerAttributes {
    playerHeight: number;
    agility: number;
    acceleration: number;
    strength: number;
}

export const getAccelerateType = (attributes: PlayerAttributes): string => {
    const { playerHeight, agility, acceleration, strength } = attributes;
    const strengthAgilityDifference = Math.abs(strength - agility); // Use absolute value

    if (playerHeight >= 188 && strength >= 80 && acceleration >= 55 && strengthAgilityDifference >= 20) {
        return 'Lengthy';
    } else if (playerHeight >= 183 && strength >= 75 && acceleration >= 55 && strengthAgilityDifference >= 12) {
        return 'Mostly Lengthy';
    } else if (playerHeight >= 181 && strength >= 65 && acceleration >= 40 && strengthAgilityDifference >= 4) {
        return 'Controlled Lengthy';
    } else if (playerHeight <= 175 && agility >= 80 && acceleration >= 80 && strengthAgilityDifference >= 20) {
        return 'Explosive';
    } else if (playerHeight <= 182 && agility >= 70 && acceleration >= 80 && strengthAgilityDifference >= 12) {
        return 'Mostly Explosive';
    } else if (playerHeight <= 182 && agility >= 65 && acceleration >= 70 && strengthAgilityDifference >= 4) {
        return 'Controlled Explosive';
    } else {
        return 'Controlled';
    }
};
