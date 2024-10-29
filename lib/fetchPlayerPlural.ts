// path/to/file.ts

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
    playerRarity: PlayerRarity; // Ensure this interface is defined
    playerRating: number;
    playerMainPos: string;
    playerExtraPos: string[];
    playerAttributes: PlayerAttributes; // Ensure this interface is defined
    playerClub: PlayerClub; // Ensure this interface is defined
    playerLeague: PlayerLeague; // Ensure this interface is defined
    playerNation: PlayerNation; // Ensure this interface is defined
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
    playerPlayStyles: PlayerPlayStyle[]; // Ensure this interface is defined
    playerPlayStylesPlus: PlayerPlayStylePlus[]; // Ensure this interface is defined
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

interface ApiResponse {
    totalPages: number;
    playersPerPage: number;
    totalPlayers: number;
  }

export interface PlayerResponse {
    mainVersion: PlayerVersion; // This can be removed if not needed
    players: PlayerVersion[]; // Updated to reflect the new structure
}

export const fetchPlayerData = async (playerId: string): Promise<PlayerResponse> => {
    const response = await fetch(`https://api.futlaurel.com/api/25/players/${playerId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch player data');
    }
    return response.json();
};

// Export the fetchPlayers function
export const fetchPlayers = async (apiUrl: string): Promise<PlayerVersion[]> => {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract players from the API response
    const players: PlayerVersion[] = data.players.map((player: any) => ({
        totalPages: data.totalPages,
        playersPerPage: data.playersPerPage,
        totalPlayers: data.totalPlayers,
        playerFirstName: player.playerFirstName,
        playerLastName: player.playerLastName,
        playerCommonName: player.playerCommonName,
        playerResourceId: player.playerResourceId,
        playerId: player.playerId,
        playerPortraitImage: player.playerPortraitImage,
        playerRarity: player.playerRarity, // Ensure this is correctly structured
        playerRating: player.playerRating,
        playerMainPos: player.playerMainPos,
        playerExtraPos: player.playerExtraPos,
        playerAttributes: player.playerAttributes,
        playerClub: player.playerClub,
        playerLeague: player.playerLeague,
        playerNation: player.playerNation,
        playerPreferredFoot: player.playerPreferredFoot,
        playerSkillMoves: player.playerSkillMoves,
        playerWeakFoot: player.playerWeakFoot,
        playerRolesPlus: player.playerRolesPlus,
        playerRolesPlusPlus: player.playerRolesPlusPlus,
        playerGender: player.playerGender,
        playerWeight: player.playerWeight,
        playerHeight: player.playerHeight,
        playerBirthDate: player.playerBirthDate,
        playerBodyTypeCode: player.playerBodyTypeCode,
        playerPlayStyles: player.playerPlayStyles,
        playerPlayStylesPlus: player.playerPlayStylesPlus,
        hasDynamic: player.hasDynamic,
        playerDynamicImage: player.playerDynamicImage,
        playerOrigin: player.playerOrigin,
        addedOn: player.addedOn,
        playerCardImages: player.playerCardImages,
    }));

    return players;
};

// ... existing code ...
