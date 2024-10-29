export interface PlayerRarity {
    rarityId: number;
    rarityNameEs: string;
    rarityNameEn: string;
    hasLevels: boolean;
    rarityColors: number[][];
    colorsPerLevel: number;
    isLogosDark: boolean;
    addedOn: number;
    rarityCardImages: {
        big: string;
        small: string;
    };
}

export interface PlayerAttributes {
    pac: number;
    acceleration: number;
    sprintSpeed: number;
    sho: number;
    positioning: number;
    finishing: number;
    shotPower: number;
    longShots: number;
    volleys: number;
    penalties: number;
    pas: number;
    vision: number;
    crossing: number;
    fkAccuracy: number;
    shortPassing: number;
    longPassing: number;
    curve: number;
    dri: number;
    agility: number;
    balance: number;
    reactions: number;
    ballControl: number;
    dribbling: number;
    composure: number;
    def: number;
    interceptions: number;
    headingAccuracy: number;
    defensiveAwareness: number;
    standingTackle: number;
    slidingTackle: number;
    phy: number;
    jumping: number;
    stamina: number;
    strength: number;
    aggression: number;
}

export interface PlayerClub {
    clubId: number;
    leagueId: number;
    clubNameEs: string;
    clubNameEn: string;
    leagueNameEs: string;
    leagueNameEn: string;
    clubImages: {
        light: string;
        dark: string;
    };
}

export interface PlayerLeague {
    leagueId: number;
    nationId: number;
    leagueNameEs: string;
    leagueNameEn: string;
    nationNameEs: string;
    nationNameEn: string;
    leagueImages: {
        light: string;
        dark: string;
    };
}

export interface PlayerNation {
    nationId: number;
    nationNameEs: string;
    nationNameEn: string;
    nationImage: string;
}

export interface PlayerPlayStyle {
    playStyleId: number;
    playStyleNameEs: string;
    playStyleNameEn: string;
    playStyleDescBaseEs: string;
    playStyleDescBaseEn: string;
    playStyleDescPlusEs: string;
    playStyleDescPlusEn: string;
    playStyleImages: {
        normal: string;
        plus: string;
        noBg: string;
    };
}

export interface PlayerPlayStylePlus {
    playStyleId: number;
    playStyleNameEs: string;
    playStyleNameEn: string;
    playStyleDescBaseEs: string;
    playStyleDescBaseEn: string;
    playStyleDescPlusEs: string;
    playStyleDescPlusEn: string;
    playStyleImages: {
        normal: string;
        plus: string;
        noBg: string;
    };
}

export interface PlayerVersion {
    playerFirstName: string;
    playerLastName: string;
    playerCommonName: string | null;
    playerResourceId: number;
    playerId: number;
    playerPortraitImage: string;
    playerRarity: PlayerRarity;
    playerRating: number;
    playerMainPos: string;
    playerExtraPos: string[];
    playerAttributes: PlayerAttributes;
    playerClub: PlayerClub;
    playerLeague: PlayerLeague;
    playerNation: PlayerNation;
    playerPreferredFoot: number;
    playerSkillMoves: number;
    playerWeakFoot: number;
    playerRolesPlus: number[];
    playerRolesPlusPlus: number[];
    playerGender: number;
    playerWeight: number;
    playerHeight: number;
    playerBirthDate: number;
    playerBodyTypeCode: number;
    playerPlayStyles: PlayerPlayStyle[];
    playerPlayStylesPlus: PlayerPlayStyle[];
    hasDynamic: boolean;
    playerDynamicImage: string | null;
    playerOrigin: number;
    addedOn: number;
    playerCardImages: {
        esNoLaurelBig: string;
        esLaurelBig: string;
        enNoLaurelBig: string;
        enLaurelBig: string;
    };
}

export interface PlayerResponse {
    mainVersion: PlayerVersion;
    otherVersions: PlayerVersion[];
}

export const fetchPlayerData = async (playerId: string): Promise<PlayerResponse> => {
    const response = await fetch(`https://api.futlaurel.com/api/25/players/${playerId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch player data');
    }
    return response.json();
};

const fetchPlayers = async () => {
    const response = await fetch('API_URL'); // Replace with your actual API URL
    const data = await response.json();
    return data.players; // Ensure we return the players array
};
