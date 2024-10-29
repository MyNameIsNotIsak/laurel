// player-search/lib/chemistry-styles.ts

interface ChemistryStyle {
    name: string;
    attributes: { [key: string]: number };
}

const chemistryStyles: ChemistryStyle[] = [
    {
        name: "Basic",
        attributes: {
            sprintSpeed: 4,
            positioning: 4,
            shotPower: 4,
            volleys: 4,
            penalties: 4,
            vision: 4,
            shortPassing: 4,
            longPassing: 4,
            curve: 4,
            agility: 4,
            ballControl: 4,
            dribbling: 4,
            marking: 4,
            standingTackle: 4,
            slidingTackle: 4,
            jumping: 4,
            strength: 4,
        }
    },
    {
        name: "Sniper",
        attributes: {
            positioning: 4,
            shotPower: 8,
            longShots: 12,
            volleys: 8,
            penalties: 4,
            jumping: 4,
            strength: 12,
            aggression: 8,
        }
    },
    {
        name: "Finisher",
        attributes: {
            positioning: 4,
            finishing: 12,
            shotPower: 8,
            volleys: 8,
            penalties: 4,
            agility: 8,
            balance: 4,
            dribbling: 12,
        }
    },
    {
        name: "Deadeye",
        attributes: {
            positioning: 8,
            finishing: 8,
            shotPower: 12,
            longShots: 4,
            penalties: 4,
            vision: 8,
            shortPassing: 12,
            curve: 4,
        }
    },
    {
        name: "Marksman",
        attributes: {
            finishing: 8,
            shotPower: 4,
            longShots: 8,
            penalties: 4,
            reactions: 4,
            ballControl: 8,
            dribbling: 8,
            jumping: 8,
            strength: 8,
        }
    },
    {
        name: "Hawk",
        attributes: {
            acceleration: 4,
            sprintSpeed: 4,
            positioning: 4,
            finishing: 4,
            shotPower: 8,
            longShots: 8,
            penalties: 4,
            jumping: 8,
            strength: 4,
            aggression: 8,
        }
    },
    {
        name: "Hunter",
        attributes: {
            acceleration: 8,
            sprintSpeed: 8,
            positioning: 4,
            finishing: 8,
            shotPower: 4,
            volleys: 12,
            penalties: 8,
        }
    },
    {
        name: "Artist",
        attributes: {
            vision: 8,
            crossing: 8,
            fkAccuracy: 4,
            longPassing: 12,
            curve: 4,
            agility: 12,
            reactions: 4,
            dribbling: 8,
        }
    },
    {
        name: "Architect",
        attributes: {
            vision: 8,
            fkAccuracy: 4,
            shortPassing: 12,
            longPassing: 4,
            curve: 8,
            jumping: 8,
            strength: 12,
            aggression: 4,
        }
    },
    {
        name: "Powerhouse",
        attributes: {
            vision: 12,
            crossing: 4,
            shortPassing: 8,
            longPassing: 8,
            curve: 4,
            interceptions: 8,
            defensiveAwareness: 4,
            standingTackle: 12,
        }
    },
    {
        name: "Maestro",
        attributes: {
            shotPower: 8,
            longShots: 8,
            volleys: 4,
            vision: 4,
            fkAccuracy: 8,
            shortPassing: 4,
            longPassing: 8,
        }
    },
    {
        name: "Engine",
        attributes: {
            acceleration: 4,
            sprintSpeed: 4,
            vision: 4,
            crossing: 8,
            shortPassing: 4,
            longPassing: 4,
            curve: 8,
            agility: 4,
            balance: 8,
            dribbling: 8,
        }
    },
    {
        name: "Catalyst",
        attributes: {
            acceleration: 8,
            sprintSpeed: 8,
            crossing: 12,
            fkAccuracy: 8,
            shortPassing: 4,
            longPassing: 8,
            curve: 4,
        }
    },
    {
        name: "Sentinel",
        attributes: {
            interceptions: 8,
            headingAccuracy: 12,
            defensiveAwareness: 8,
            standingTackle: 4,
            slidingTackle: 4,
            jumping: 12,
            strength: 12,
            aggression: 8,
        }
    },
    {
        name: "Guardian",
        attributes: {
            balance: 8,
            ballControl: 4,
            dribbling: 12,
            interceptions: 8,
            headingAccuracy: 4,
            defensiveAwareness: 8,
            standingTackle: 12,
            slidingTackle: 8,
        }
    },
    {
        name: "Gladiator",
        attributes: {
            finishing: 12,
            shotPower: 8,
            volleys: 4,
            interceptions: 8,
            headingAccuracy: 4,
            defensiveAwareness: 4,
            standingTackle: 8,
            slidingTackle: 12,
        }
    },
    {
        name: "Backbone",
        attributes: {
            vision: 8,
            longPassing: 8,
            interceptions: 8,
            defensiveAwareness: 4,
            standingTackle: 8,
            slidingTackle: 4,
            jumping: 8,
            strength: 4,
            aggression: 8,
        }
    },
    {
        name: "Anchor",
        attributes: {
            acceleration: 4,
            sprintSpeed: 4,
            interceptions: 4,
            headingAccuracy: 4,
            defensiveAwareness: 4,
            standingTackle: 8,
            slidingTackle: 8,
            jumping: 8,
            strength: 8,
            aggression: 4,
        }
    },
    {
        name: "Shadow",
        attributes: {
            acceleration: 8,
            sprintSpeed: 8,
            interceptions: 8,
            headingAccuracy: 4,
            defensiveAwareness: 4,
            standingTackle: 8,
            slidingTackle: 12,
        }
    },
    {
        name: "GK Basic",
        attributes: {
            pac: 4,
            sho: 4,
            pas: 4,
            dri: 4,
            acceleration: 4,
            phy: 4,
        }
    },
    {
        name: "Wall",
        attributes: {
            pac: 12,
            sho: 4,
            pas: 8,
        }
    },
    {
        name: "Shield",
        attributes: {
            pas: 8,
            dri: 12,
            sprintSpeed: 4,
        }
    },
    {
        name: "Cat",
        attributes: {
            dri: 8,
            acceleration: 4,
            phy: 12,
        }
    },
    {
        name: "Glove",
        attributes: {
            pac: 8,
            sho: 12,
            phy: 4,
        }
    },
];

// Function to get attributes for a specific chemistry style
export function getChemistryStyleAttributes(styleName: string): { [key: string]: number } | undefined {
    const style = chemistryStyles.find(s => s.name === styleName);
    return style ? style.attributes : undefined;
}

// Export the chemistryStyles array if needed
export const allChemistryStyles = chemistryStyles;

// Function to generate SVG filenames based on chemistry style names
export function getChemistryStyleSVG(styleName: string): string {
    // Remove unwanted prefixes (e.g., "GK ", "Cat ", etc.)
    const cleanedStyleName = styleName.replace(/^(GK|Cat|Shield|Wall|Glove|Shadow|Anchor|Sentinel|Guardian|Gladiator|Backbone|Powerhouse|Maestro|Engine|Artist|Architect|Hunter|Hawk|Marksman|Finisher|Sniper|Deadeye|Chemistry|Basic)\s+/i, '');
    return `chemstyle_${cleanedStyleName.toLowerCase().replace(/\s+/g, '_')}.svg`; // Convert to lowercase and replace spaces with underscores
}

// Example usage of the SVG function
const exampleSVG = getChemistryStyleSVG("Artist");
console.log(exampleSVG); // Outputs: "chemstyle_artist.svg"

// ... existing code ...

