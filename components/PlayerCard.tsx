import React from 'react';
import Image from 'next/image';
import styles from './PlayerCard.module.css'; // Import the new CSS module

interface PlayerCardProps {
    playerData: any; // Replace 'any' with the appropriate type
    textColor: string;
    selectedStyle: string | null;
    getChemistryStyleSVGCode: (styleName: string) => string;
    nationImageSrc: string;
    leagueImageSrc: string;
    isLogosDark: boolean;
    playerMainPos: string;
    mainVersion: any; // Replace 'any' with the appropriate type
}

const PlayerCard: React.FC<PlayerCardProps> = ({
    playerData,
    textColor,
    selectedStyle,
    getChemistryStyleSVGCode,
    nationImageSrc,
    leagueImageSrc,
    isLogosDark,
    playerMainPos,
    mainVersion
}) => {
    return (
        <div className={styles.playerCard}>
            <div className={styles.cardContainer}>
                <div 
                    className={styles.cardAspectRatio} 
                    style={{ 
                        backgroundImage: `url(${playerData?.mainVersion.playerRarity.rarityCardImages.big})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className={styles.attributesName} style={{ color: textColor }}>
                        <span className={styles.attribute}>
                            {playerData?.mainVersion.playerCommonName || playerData?.mainVersion.playerLastName}
                        </span>
                    </div>
                    {!playerData?.mainVersion.hasDynamic && (
                        <Image 
                            src={playerData?.mainVersion.playerPortraitImage || ''} 
                            alt={`${playerData?.mainVersion.playerCommonName || playerData?.mainVersion.playerLastName} portrait`} 
                            width={300}
                            height={300}
                            className={styles.playerPortrait}
                        />
                    )}
                    <div className={styles.attributesText} style={{ color: textColor }}>
                        <span className={styles.attribute}>PAC</span>
                        <span className={styles.attribute}>SHO</span>
                        <span className={styles.attribute}>PAS</span>
                        <span className={styles.attribute}>DRI</span>
                        <span className={styles.attribute}>DEF</span>
                        <span className={styles.attribute}>PHY</span>
                    </div>
                    <div className={styles.attributesOverlay} style={{ color: textColor }}>
                        <span className={styles.attribute}>{playerData?.mainVersion.playerAttributes.pac}</span>
                        <span className={styles.attribute}>{playerData?.mainVersion.playerAttributes.sho}</span>
                        <span className={styles.attribute}>{playerData?.mainVersion.playerAttributes.pas}</span>
                        <span className={styles.attribute}>{playerData?.mainVersion.playerAttributes.dri}</span>
                        <span className={styles.attribute}>{playerData?.mainVersion.playerAttributes.def}</span>
                        <span className={styles.attribute}>{playerData?.mainVersion.playerAttributes.phy}</span>
                    </div>
                    <div className={styles.playerRatingPosition}>
                        <span style={{ color: textColor }} className={styles.playerRating}>{mainVersion.playerRating}</span>
                        <span style={{ color: textColor }} className={styles.playerMainPos}>{playerMainPos}</span>
                        {selectedStyle && (
                            <div
                                className={styles.chemistryStyleSVG}
                                dangerouslySetInnerHTML={{
                                    __html: getChemistryStyleSVGCode(selectedStyle).replace(
                                        /fill="[^"]*"/g,
                                        `fill="rgb(${textColor})"`
                                    ),
                                }}
                            />
                        )}
                    </div>
                    {playerData?.mainVersion.hasDynamic && (
                        <div className={styles.dynamicImageContainer}>
                            <img 
                                src={playerData?.mainVersion.playerDynamicImage || ''} 
                                alt="Dynamic Player Image" 
                                className={styles.dynamicImage}
                            />
                        </div>
                    )}
                    <div className={styles.imagesSection}>
                        <Image 
                            src={nationImageSrc} 
                            alt="Nation Image" 
                            width={50} 
                            height={50} 
                        />
                        <Image 
                            src={leagueImageSrc} 
                            alt="League Image" 
                            width={50} 
                            height={50} 
                        />
                        {(playerData?.mainVersion.playerClub.clubNameEn !== "ICON" && playerData?.mainVersion.playerClub.clubNameEn !== "HERO") && (
                            <Image 
                                src={isLogosDark 
                                    ? playerData?.mainVersion.playerClub.clubImages.dark 
                                    : playerData?.mainVersion.playerClub.clubImages.light || ''} 
                                alt="Club Image" 
                                width={50} 
                                height={50} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;

