export interface PlayerAttributes {
    sprintSpeed: number;
    acceleration: number;
    finishing: number;
    longShots: number;
    shotPower: number;
    volleys: number;
    positioning: number;
    penalties: number;
    shortPassing: number;
    crossing: number;
    vision: number;
    longPassing: number;
    curve: number;
    fkAccuracy: number;
    dribbling: number;
    ballControl: number;
    agility: number;
    balance: number;
    standingTackle: number;
    defensiveAwareness: number;
    interceptions: number;
    headingAccuracy: number;
    slidingTackle: number;
    strength: number;
    stamina: number;
    aggression: number;
    jumping: number;
}

export const calculateOverallAttributes = (
    baseAttributes: PlayerAttributes, 
    modifiedAttributes: Partial<PlayerAttributes>, 
    chemistry: string
) => {
    const getAttributeValue = (baseValue: number, modifiedValue?: number) => {
        if (modifiedValue === undefined) return baseValue;
        let calculatedValue;
        if (chemistry === 'chemistry2') {
            calculatedValue = baseValue + Math.floor(modifiedValue / 2);
        } else if (chemistry === 'chemistry1') {
            calculatedValue = baseValue + Math.floor(modifiedValue / 4);
        } else {
            calculatedValue = baseValue + modifiedValue;
        }
        return Math.min(calculatedValue, 99); // Ensure the value does not exceed 99
    };

    const pac = Math.round(
        0.55 * getAttributeValue(baseAttributes.sprintSpeed, modifiedAttributes.sprintSpeed) +
         0.45 * getAttributeValue(baseAttributes.acceleration, modifiedAttributes.acceleration)
    );

    const sho = Math.round(
        0.45 * getAttributeValue(baseAttributes.finishing, modifiedAttributes.finishing) +
        0.20 * getAttributeValue(baseAttributes.longShots, modifiedAttributes.longShots) +
        0.20 * getAttributeValue(baseAttributes.shotPower, modifiedAttributes.shotPower) +
        0.05 * getAttributeValue(baseAttributes.volleys, modifiedAttributes.volleys) +
        0.05 * getAttributeValue(baseAttributes.positioning, modifiedAttributes.positioning) +
        0.05 * getAttributeValue(baseAttributes.penalties, modifiedAttributes.penalties)
    );

    const pas = Math.round(
        0.35 * getAttributeValue(baseAttributes.shortPassing, modifiedAttributes.shortPassing) +
        0.20 * getAttributeValue(baseAttributes.crossing, modifiedAttributes.crossing) +
        0.20 * getAttributeValue(baseAttributes.vision, modifiedAttributes.vision) +
        0.15 * getAttributeValue(baseAttributes.longPassing, modifiedAttributes.longPassing) +
        0.05 * getAttributeValue(baseAttributes.curve, modifiedAttributes.curve) +
        0.05 * getAttributeValue(baseAttributes.fkAccuracy, modifiedAttributes.fkAccuracy)
    );

    const dri = Math.round(
        0.50 * getAttributeValue(baseAttributes.dribbling, modifiedAttributes.dribbling) +
        0.35 * getAttributeValue(baseAttributes.ballControl, modifiedAttributes.ballControl) +
        0.10 * getAttributeValue(baseAttributes.agility, modifiedAttributes.agility) +
        0.05 * getAttributeValue(baseAttributes.balance, modifiedAttributes.balance)
    );

    const def = Math.round(
        0.30 * getAttributeValue(baseAttributes.standingTackle, modifiedAttributes.standingTackle) +
        0.30 * getAttributeValue(baseAttributes.defensiveAwareness, modifiedAttributes.defensiveAwareness) +
        0.20 * getAttributeValue(baseAttributes.interceptions, modifiedAttributes.interceptions) +
        0.10 * getAttributeValue(baseAttributes.headingAccuracy, modifiedAttributes.headingAccuracy) +
        0.10 * getAttributeValue(baseAttributes.slidingTackle, modifiedAttributes.slidingTackle)
    );

    const phy = Math.round(
        0.50 * getAttributeValue(baseAttributes.strength, modifiedAttributes.strength) +
        0.25 * getAttributeValue(baseAttributes.stamina, modifiedAttributes.stamina) +
        0.20 * getAttributeValue(baseAttributes.aggression, modifiedAttributes.aggression) +
        0.05 * getAttributeValue(baseAttributes.jumping, modifiedAttributes.jumping)
    );

    return { pac, sho, pas, dri, def, phy };
};
