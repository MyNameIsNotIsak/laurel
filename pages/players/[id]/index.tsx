import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { fetchPlayerData, PlayerResponse, PlayerRarity } from '../../../lib/fetchPlayer';
import styles from '../../../styles/PlayerPage.module.css';
import '../../../app/globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { roles } from '../../../lib/roles';
import { getChemistryStyleAttributes, getChemistryStyleSVG, allChemistryStyles } from '../../../lib/chemistry-styles';
import { getAccelerateType, PlayerAttributes } from '../../../lib/accelerateLogic';
import Layout from '../../../components/layout';
import { calculateOverallAttributes } from '../../../lib/calculateAttributes';
import PlayerCard from '../../../components/PlayerCard';

interface PlayerPageProps {
    playerId: string;
}

const PlayerPage: React.FC<PlayerPageProps> = ({ playerId }) => {
    const [playerData, setPlayerData] = useState<PlayerResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [modifiedAttributes, setModifiedAttributes] = useState<{ [key: string]: number }>({});
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedChemistry, setSelectedChemistry] = useState<string>('chemistry3');

    const handleChemistryStyleClick = (styleName: string) => {
        if (selectedStyle === styleName) {
            setSelectedStyle(null);
            setModifiedAttributes({});
        } else {
            setSelectedStyle(styleName);
            const attributes = getChemistryStyleAttributes(styleName);
            if (attributes) {
                setModifiedAttributes(attributes);
            }
        }
    };

    const applyChemistryAttributes = (chemistry: string) => {
        let newAttributes: { [key: string]: number } = {};

        if (chemistry === 'chemistry3') {
            newAttributes = getChemistryStyleAttributes('chemistry3') || {};
        } else if (chemistry === 'chemistry2') {
            const fullAttributes = getChemistryStyleAttributes('chemistry3') || {};
            newAttributes = Object.fromEntries(
                Object.entries(fullAttributes).map(([key, value]) => [key, Math.floor(value / 2)])
            );
        } else if (chemistry === 'chemistry1') {
            const fullAttributes = getChemistryStyleAttributes('chemistry2') || {};
            newAttributes = Object.fromEntries(
                Object.entries(fullAttributes).map(([key, value]) => [key, Math.floor(value / 2)])
            );
        }

        setModifiedAttributes(prevAttributes => ({
            ...prevAttributes,
            ...newAttributes,
        }));
    };

    const handleChemistryClick = (chemistry: string) => {
        if (selectedChemistry !== chemistry) {
            setSelectedChemistry(chemistry);
            applyChemistryAttributes(chemistry);
        }
    };

    const updateOverallAttributes = () => {
        if (playerData) {
            const baseAttributes = playerData.mainVersion.playerAttributes;
            let updatedAttributes;

            // Check if modifiedAttributes is being used (i.e., it has any keys)
            const isModified = Object.keys(modifiedAttributes).length > 0;

            if (isModified && selectedStyle) {
                // Calculate modified attributes when a chemistry style is selected
                updatedAttributes = calculateOverallAttributes(baseAttributes, modifiedAttributes, selectedChemistry);
            } else {
                // Revert to base attributes when no chemistry style is selected
                updatedAttributes = { ...baseAttributes };
            }

            setPlayerData(prevData => prevData ? ({
                ...prevData,
                mainVersion: {
                    ...prevData.mainVersion,
                    playerAttributes: {
                        ...prevData.mainVersion.playerAttributes,
                        ...updatedAttributes
                    }
                }
            }) : null);
        }
    };

    useEffect(() => {
        updateOverallAttributes();
    }, [modifiedAttributes, selectedStyle]);

    useEffect(() => {
        const getPlayerData = async () => {
            try {
                const data = await fetchPlayerData(playerId);
                setPlayerData(data);
                // Reset chemistry styles and select chemistry3
                setSelectedStyle(null);
                setSelectedChemistry('chemistry3');
                setModifiedAttributes({}); // Reset modified attributes
                applyChemistryAttributes('chemistry3');
            } catch (error) {
                console.error("Error fetching player data:", error);
            } finally {
                setLoading(false);
            }
        };

        getPlayerData();
    }, [playerId]);

    const getRoleName = (id: number) => {
        const role = roles.find(role => role.ea_id === id);
        return role ? role.name : 'Unknown Role';
    };

    const playerMainPos = playerData?.mainVersion.playerMainPos;

    const rarityColor = playerData?.mainVersion.playerRarity.rarityColors[0];
    const textColor = rarityColor ? `rgb(${rarityColor[0]}, ${rarityColor[1]}, ${rarityColor[2]})` : 'white';

    // Access isLogosDark from playerData's mainVersion playerRarity
    const isLogosDark = playerData?.mainVersion.playerRarity.isLogosDark;

    // Determine the image sources based on isLogosDark
    const leagueImageSrc = isLogosDark 
        ? playerData?.mainVersion.playerLeague.leagueImages.dark 
        : playerData?.mainVersion.playerLeague.leagueImages.light || '';

    // Ensure the image source is always a string
    const nationImageSrc = playerData?.mainVersion.playerNation.nationImage || '';

    const getChemistryStyleSVGCode = (styleName: string): string => {
        // Example implementation: return the SVG code as a string
        switch (styleName) {
            case 'style1':
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="currentColor" />
                        </svg>`;
            case 'style2':
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                            <rect width="100" height="100" fill="currentColor" />
                        </svg>`;
            // Add more cases as needed
            default:
                return ''; // Return an empty string if no match
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!playerData) return <p>Player not found.</p>;

    const { mainVersion, otherVersions } = playerData;

    const filteredChemistryStyles = allChemistryStyles.filter(style => {
        if (playerMainPos === "GK") {
            return ["GK Basic", "Wall", "Shield", "Cat", "Glove"].includes(style.name);
        } else {
            return !["GK Basic", "Wall", "Shield", "Cat", "Glove"].includes(style.name);
        }
    });

    const calculateModifiedAttribute = (baseValue: number, modifiedValue: number | undefined, chemistry: string) => {
        if (modifiedValue === undefined) return baseValue;
        if (chemistry === 'chemistry2') return baseValue + Math.floor(modifiedValue / 2);
        if (chemistry === 'chemistry1') return baseValue + Math.floor(modifiedValue / 4);
        return baseValue + modifiedValue;
    };

    const playerAttributes: PlayerAttributes = {
        playerHeight: mainVersion.playerHeight,
        agility: calculateModifiedAttribute(mainVersion.playerAttributes.agility, modifiedAttributes.agility, selectedChemistry),
        acceleration: calculateModifiedAttribute(mainVersion.playerAttributes.acceleration, modifiedAttributes.acceleration, selectedChemistry),
        strength: calculateModifiedAttribute(mainVersion.playerAttributes.strength, modifiedAttributes.strength, selectedChemistry),
    };

    const accelerateType = getAccelerateType(playerAttributes);

    return (
        <Layout>
        <div className={styles.container}> {/* Main container */}
            <div className={styles.playerCardInfo}>
            <PlayerCard
                    playerData={playerData}
                    textColor={textColor}
                    selectedStyle={selectedStyle}
                    getChemistryStyleSVGCode={getChemistryStyleSVGCode}
                    nationImageSrc={nationImageSrc}
                    leagueImageSrc={leagueImageSrc}
                    isLogosDark={isLogosDark ?? false}
                    playerMainPos={playerMainPos ?? ''}
                    mainVersion={mainVersion}
                />
                {/* Other components and sections */}
                {/* New Roles Section */}
                <div className={styles.rolesSection}>
                    <div className={styles.rolesGrid}>
                    {mainVersion.playerRolesPlusPlus && mainVersion.playerRolesPlusPlus.length > 0 && mainVersion.playerRolesPlusPlus.map(roleId => (
                            <div key={roleId} className={styles.roleItemPlus}>
                                <span>{getRoleName(roleId)}</span>
                            </div>
                        ))}
                        {mainVersion.playerRolesPlus && mainVersion.playerRolesPlus.length > 0 && mainVersion.playerRolesPlus.map(roleId => (
                            <div key={roleId} className={styles.roleItem}>
                                <span>{getRoleName(roleId)}</span>
                            </div>
                        ))}
                        
                    </div>
                </div>

                <div className={styles.playStylesSection}> {/* Player play styles section */}
                <div className={styles.playStylesGrid}> {/* Grid container */}
                    {mainVersion.playerPlayStyles.map(style => (
                        <div key={style.playStyleId} className={styles.playStyleItem}>
                            
                            <span className={styles.tooltip}>
                                <span className={styles.icon} style={{ cursor: 'pointer' }}>🛈</span>
                                <p className={styles.description}>{style.playStyleDescBaseEn}</p> {/* Description */}
                            </span>
                            <Image 
                                src={require(`/Images/playstyles-basic/basetrait${style.playStyleId}.svg`)} // Updated to use require
                                alt={`${style.playStyleNameEn} icon`} 
                                width={50} // Set appropriate width
                                height={50} // Set appropriate height
                            />
                            <strong>{style.playStyleNameEn}</strong>
                        </div>
                    ))}
                </div>
            </div>

                <div className={styles.otherVersionsSection}> {/* Other versions section */}
    <h2 className={styles.subtitle}>Other Versions</h2>
    {otherVersions.length > 0 ? (
        <div className={styles.otherVersionsContainer}>
            {otherVersions.map((version, index) => (
                <Link key={index} href={`${version.playerResourceId}`}> {/* Redirect to the other version's page */}
                    <div className={styles.otherVersion}>
                        <div className={styles.overlay}>
                            <Image 
                                src={version.playerCardImages.enNoLaurelBig || mainVersion.playerCardImages.enNoLaurelBig} // Fallback to main version image
                                alt={version.playerCommonName || `${version.playerFirstName} ${version.playerLastName}`} 
                                width={200} // specify width
                                height={300} // specify height
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    ) : (
        <p>No other versions available.</p>
    )}
</div>

                <div className={styles.playerInfo}> {/* Player info section */}
                <p><strong>Height:</strong> {mainVersion.playerHeight} cm</p>
                <p><strong>Weight:</strong> {mainVersion.playerWeight} kg</p>
                <p><strong>Club:</strong> {mainVersion.playerClub.clubNameEn}</p>
                <p><strong>League:</strong> {mainVersion.playerLeague.leagueNameEn}</p>
                <p><strong>Nationality:</strong> {mainVersion.playerNation.nationNameEn}</p>
                <p><strong>Preferred Foot:</strong> {mainVersion.playerPreferredFoot === 1 ? 'Left' : 'Right'}</p>
                <p><strong>Skill Moves:</strong> {mainVersion.playerSkillMoves}★</p>
                <p><strong>Weak Foot:</strong> {mainVersion.playerWeakFoot}★</p>
                <p><strong>Birth Date:</strong> {new Date(mainVersion.playerBirthDate * 1000).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {mainVersion.playerGender === 0 ? 'Male' : 'Female'}</p>
                <p><strong>Body Type:</strong> {mainVersion.playerBodyTypeCode}</p>
                <p><strong>Extra Positions:</strong> {mainVersion.playerExtraPos ? mainVersion.playerExtraPos.join(', ') : 'None'}</p>
            </div>
            </div>
<div className={styles.cardDetails}>
  <div className={styles.priceMomentum} ><h2>TEMP</h2></div>
  <div className={styles.price} ><h2>TEMP</h2></div>


<div className={styles.attributesSection}>
    <div className={styles.attributesGrid}>
        <div className={styles.category}>
        <div className={styles.sectionName}>
            <h3>{playerMainPos === "GK" ? "Diving" : "Pace"}</h3>
            <h3 style={{ color: getAttributeColor(mainVersion.playerAttributes.pac) }}>
                {mainVersion.playerAttributes.pac}
            </h3>
            </div>
            {playerMainPos === "GK" ? (
                <>
                    <div className={styles.attributeItem}>
                        <strong>Diving:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.pac !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.pac / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.pac / 4) : 
                                      modifiedAttributes.pac}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(Math.min(mainVersion.playerAttributes.pac + (modifiedAttributes.pac || 0), 99)) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.pac + 
                                        (modifiedAttributes.pac !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.pac / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.pac / 4) : 
                                             modifiedAttributes.pac) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.accelerateItem}>
                        <strong>Accelerate:</strong>
                        <div className={styles.accelerateName}>
                            <p>{accelerateType}</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.attributeItem}>
                        <strong>Acceleration:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.acceleration !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.acceleration / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.acceleration / 4) : 
                                      modifiedAttributes.acceleration}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(Math.min(mainVersion.playerAttributes.acceleration + (modifiedAttributes.acceleration || 0), 99)) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.acceleration + 
                                        (modifiedAttributes.acceleration !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.acceleration / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.acceleration / 4) : 
                                             modifiedAttributes.acceleration) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Sprint Speed:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.sprintSpeed !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.sprintSpeed / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.sprintSpeed / 4) : 
                                      modifiedAttributes.sprintSpeed}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(Math.min(mainVersion.playerAttributes.sprintSpeed + (modifiedAttributes.sprintSpeed || 0), 99)) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.sprintSpeed + 
                                        (modifiedAttributes.sprintSpeed !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.sprintSpeed / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.sprintSpeed / 4) : 
                                             modifiedAttributes.sprintSpeed) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.accelerateItem}>
                        <strong>Accelerate:</strong>
                        <div className={styles.accelerateName}>
                            <p>{accelerateType}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
        <div className={styles.category}>
        <div className={styles.sectionName}>
            <h3>{playerMainPos === "GK" ? "Handling" : "Shooting"}</h3>
            <h3 style={{ color: getAttributeColor(mainVersion.playerAttributes.sho) }}>
                {mainVersion.playerAttributes.sho}
            </h3>
            </div>
            {playerMainPos === "GK" ? (
                <div className={styles.attributeItem}>
                    <strong>Handling:</strong>
                    <div className={styles.attributeValues}>
                        {modifiedAttributes.sho !== undefined ? (
                            <span className={styles.modifiedAttribute}>
                                +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.sho / 2) : 
                                  selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.sho / 4) : 
                                  modifiedAttributes.sho}
                            </span>
                        ) : null}
                        <div style={{ backgroundColor: getAttributeColor(Math.min(mainVersion.playerAttributes.sho + (modifiedAttributes.sho || 0), 99)) }}>
                            <p>
                                {Math.min(
                                    mainVersion.playerAttributes.sho + 
                                    (modifiedAttributes.sho !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.sho / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.sho / 4) : 
                                         modifiedAttributes.sho) : 0), 
                                    99
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.attributeItem}>
                        <strong>Positioning:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.positioning !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.positioning / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.positioning / 4) : 
                                      modifiedAttributes.positioning}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.positioning + 
                                    (modifiedAttributes.positioning !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.positioning / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.positioning / 4) : 
                                         modifiedAttributes.positioning) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.positioning + 
                                        (modifiedAttributes.positioning !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.positioning / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.positioning / 4) : 
                                             modifiedAttributes.positioning) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Finishing:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.finishing !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.finishing / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.finishing / 4) : 
                                      modifiedAttributes.finishing}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.finishing + 
                                    (modifiedAttributes.finishing !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.finishing / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.finishing / 4) : 
                                         modifiedAttributes.finishing) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.finishing + 
                                        (modifiedAttributes.finishing !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.finishing / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.finishing / 4) : 
                                             modifiedAttributes.finishing) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Shot Power:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.shotPower !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.shotPower / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.shotPower / 4) : 
                                      modifiedAttributes.shotPower}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.shotPower + 
                                    (modifiedAttributes.shotPower !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.shotPower / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.shotPower / 4) : 
                                         modifiedAttributes.shotPower) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.shotPower + 
                                        (modifiedAttributes.shotPower !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.shotPower / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.shotPower / 4) : 
                                             modifiedAttributes.shotPower) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Long Shots:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.longShots !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.longShots / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.longShots / 4) : 
                                      modifiedAttributes.longShots}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.longShots + 
                                    (modifiedAttributes.longShots !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.longShots / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.longShots / 4) : 
                                         modifiedAttributes.longShots) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.longShots + 
                                        (modifiedAttributes.longShots !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.longShots / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.longShots / 4) : 
                                             modifiedAttributes.longShots) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Volleys:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.volleys !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.volleys / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.volleys / 4) : 
                                      modifiedAttributes.volleys}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.volleys + 
                                    (modifiedAttributes.volleys !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.volleys / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.volleys / 4) : 
                                         modifiedAttributes.volleys) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.volleys + 
                                        (modifiedAttributes.volleys !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.volleys / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.volleys / 4) : 
                                             modifiedAttributes.volleys) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Penalties:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.penalties !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.penalties / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.penalties / 4) : 
                                      modifiedAttributes.penalties}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.penalties + 
                                    (modifiedAttributes.penalties !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.penalties / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.penalties / 4) : 
                                         modifiedAttributes.penalties) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.penalties + 
                                        (modifiedAttributes.penalties !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.penalties / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.penalties / 4) : 
                                             modifiedAttributes.penalties) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
        <div className={styles.category}>
        <div className={styles.sectionName}>
            <h3>{playerMainPos === "GK" ? "Kicking" : "Passing"}</h3>
            <h3 style={{ color: getAttributeColor(mainVersion.playerAttributes.pas) }}>
                {mainVersion.playerAttributes.pas}
            </h3>
            </div>
            {playerMainPos === "GK" ? (
                <div className={styles.attributeItem}>
                    <strong>Kicking:</strong>
                    <div className={styles.attributeValues}>
                        {modifiedAttributes.pas !== undefined ? (
                            <span className={styles.modifiedAttribute}>
                                +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.pas / 2) : 
                                  selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.pas / 4) : 
                                  modifiedAttributes.pas}
                            </span>
                        ) : null}
                        <div style={{ backgroundColor: getAttributeColor(
                            Math.min(
                                mainVersion.playerAttributes.pas + 
                                (modifiedAttributes.pas !== undefined ? 
                                    (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.pas / 2) : 
                                     selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.pas / 4) : 
                                     modifiedAttributes.pas) : 0), 
                                99
                            )
                        ) }}>
                            <p>
                                {Math.min(
                                    mainVersion.playerAttributes.pas + 
                                    (modifiedAttributes.pas !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.pas / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.pas / 4) : 
                                         modifiedAttributes.pas) : 0), 
                                    99
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.attributeItem}>
                        <strong>Vision:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.vision !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.vision / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.vision / 4) : 
                                      modifiedAttributes.vision}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.vision + 
                                    (modifiedAttributes.vision !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.vision / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.vision / 4) : 
                                         modifiedAttributes.vision) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.vision + 
                                        (modifiedAttributes.vision !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.vision / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.vision / 4) : 
                                             modifiedAttributes.vision) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Crossing:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.crossing !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.crossing / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.crossing / 4) : 
                                      modifiedAttributes.crossing}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.crossing + 
                                    (modifiedAttributes.crossing !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.crossing / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.crossing / 4) : 
                                         modifiedAttributes.crossing) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.crossing + 
                                        (modifiedAttributes.crossing !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.crossing / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.crossing / 4) : 
                                             modifiedAttributes.crossing) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Free Kick Accuracy:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.fkAccuracy !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.fkAccuracy / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.fkAccuracy / 4) : 
                                      modifiedAttributes.fkAccuracy}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.fkAccuracy + 
                                    (modifiedAttributes.fkAccuracy !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.fkAccuracy / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.fkAccuracy / 4) : 
                                         modifiedAttributes.fkAccuracy) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.fkAccuracy + 
                                        (modifiedAttributes.fkAccuracy !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.fkAccuracy / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.fkAccuracy / 4) : 
                                             modifiedAttributes.fkAccuracy) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Short Passing:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.shortPassing !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.shortPassing / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.shortPassing / 4) : 
                                      modifiedAttributes.shortPassing}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.shortPassing + 
                                    (modifiedAttributes.shortPassing !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.shortPassing / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.shortPassing / 4) : 
                                         modifiedAttributes.shortPassing) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.shortPassing + 
                                        (modifiedAttributes.shortPassing !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.shortPassing / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.shortPassing / 4) : 
                                             modifiedAttributes.shortPassing) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Long Passing:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.longPassing !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.longPassing / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.longPassing / 4) : 
                                      modifiedAttributes.longPassing}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.longPassing + 
                                    (modifiedAttributes.longPassing !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.longPassing / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.longPassing / 4) : 
                                         modifiedAttributes.longPassing) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.longPassing + 
                                        (modifiedAttributes.longPassing !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.longPassing / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.longPassing / 4) : 
                                             modifiedAttributes.longPassing) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Curve:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.curve !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.curve / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.curve / 4) : 
                                      modifiedAttributes.curve}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.curve + 
                                    (modifiedAttributes.curve !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.curve / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.curve / 4) : 
                                         modifiedAttributes.curve) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.curve + 
                                        (modifiedAttributes.curve !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.curve / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.curve / 4) : 
                                             modifiedAttributes.curve) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
        <div className={styles.category}>
        <div className={styles.sectionName}>
            <h3>{playerMainPos === "GK" ? "Reflexes" : "Dribbling"}</h3>
            <h3 style={{ color: getAttributeColor(mainVersion.playerAttributes.dri) }}>
                {mainVersion.playerAttributes.dri}
            </h3>
            </div>
            {playerMainPos === "GK" ? (
                <div className={styles.attributeItem}>
                    <strong>Reflexes:</strong>
                    <div className={styles.attributeValues}>
                        {modifiedAttributes.dri !== undefined ? (
                            <span className={styles.modifiedAttribute}>
                                +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.dri / 2) : 
                                  selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.dri / 4) : 
                                  modifiedAttributes.dri}
                            </span>
                        ) : null}
                        <div style={{ backgroundColor: getAttributeColor(
                            Math.min(
                                mainVersion.playerAttributes.dri + 
                                (modifiedAttributes.dri !== undefined ? 
                                    (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.dri / 2) : 
                                     selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.dri / 4) : 
                                     modifiedAttributes.dri) : 0), 
                                99
                            )
                        ) }}>
                            <p>
                                {Math.min(
                                    mainVersion.playerAttributes.dri + 
                                    (modifiedAttributes.dri !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.dri / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.dri / 4) : 
                                         modifiedAttributes.dri) : 0), 
                                    99
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.attributeItem}>
                        <strong>Agility:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.agility !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.agility / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.agility / 4) : 
                                      modifiedAttributes.agility}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.agility + 
                                    (modifiedAttributes.agility !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.agility / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.agility / 4) : 
                                         modifiedAttributes.agility) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.agility + 
                                        (modifiedAttributes.agility !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.agility / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.agility / 4) : 
                                             modifiedAttributes.agility) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Balance:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.balance !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.balance / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.balance / 4) : 
                                      modifiedAttributes.balance}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.balance + 
                                    (modifiedAttributes.balance !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.balance / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.balance / 4) : 
                                         modifiedAttributes.balance) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.balance + 
                                        (modifiedAttributes.balance !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.balance / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.balance / 4) : 
                                             modifiedAttributes.balance) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Reactions:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.reactions !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.reactions / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.reactions / 4) : 
                                      modifiedAttributes.reactions}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.reactions + 
                                    (modifiedAttributes.reactions !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.reactions / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.reactions / 4) : 
                                         modifiedAttributes.reactions) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.reactions + 
                                        (modifiedAttributes.reactions !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.reactions / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.reactions / 4) : 
                                             modifiedAttributes.reactions) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Ball Control:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.ballControl !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.ballControl / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.ballControl / 4) : 
                                      modifiedAttributes.ballControl}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.ballControl + 
                                    (modifiedAttributes.ballControl !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.ballControl / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.ballControl / 4) : 
                                         modifiedAttributes.ballControl) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.ballControl + 
                                        (modifiedAttributes.ballControl !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.ballControl / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.ballControl / 4) : 
                                             modifiedAttributes.ballControl) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Dribbling:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.dribbling !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.dribbling / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.dribbling / 4) : 
                                      modifiedAttributes.dribbling}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.dribbling + 
                                    (modifiedAttributes.dribbling !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.dribbling / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.dribbling / 4) : 
                                         modifiedAttributes.dribbling) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.dribbling + 
                                        (modifiedAttributes.dribbling !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.dribbling / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.dribbling / 4) : 
                                             modifiedAttributes.dribbling) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Composure:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.composure !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.composure / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.composure / 4) : 
                                      modifiedAttributes.composure}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.composure + 
                                    (modifiedAttributes.composure !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.composure / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.composure / 4) : 
                                         modifiedAttributes.composure) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.composure + 
                                        (modifiedAttributes.composure !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.composure / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.composure / 4) : 
                                             modifiedAttributes.composure) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
        <div className={styles.category}>
        <div className={styles.sectionName}>
            <h3>{playerMainPos === "GK" ? "Speed" : "Physical"}</h3>
            <h3 style={{ color: getAttributeColor(mainVersion.playerAttributes.phy) }}>
                {mainVersion.playerAttributes.phy}
            </h3>
            </div>
            {playerMainPos === "GK" ? (
                <div className={styles.attributeItem}>
                    <strong>Positioning:</strong>
                    <div className={styles.attributeValues}>
                        {modifiedAttributes.phy !== undefined ? (
                            <span className={styles.modifiedAttribute}>
                                +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.phy / 2) : 
                                  selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.phy / 4) : 
                                  modifiedAttributes.phy}
                            </span>
                        ) : null}
                        <div style={{ backgroundColor: getAttributeColor(
                            Math.min(
                                mainVersion.playerAttributes.phy + 
                                (modifiedAttributes.phy !== undefined ? 
                                    (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.phy / 2) : 
                                     selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.phy / 4) : 
                                     modifiedAttributes.phy) : 0), 
                                99
                            )
                        ) }}>
                            <p>
                                {Math.min(
                                    mainVersion.playerAttributes.phy + 
                                    (modifiedAttributes.phy !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.phy / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.phy / 4) : 
                                         modifiedAttributes.phy) : 0), 
                                    99
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.attributeItem}>
                        <strong>Jumping:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.jumping !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.jumping / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.jumping / 4) : 
                                      modifiedAttributes.jumping}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.jumping + 
                                    (modifiedAttributes.jumping !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.jumping / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.jumping / 4) : 
                                         modifiedAttributes.jumping) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.jumping + 
                                        (modifiedAttributes.jumping !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.jumping / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.jumping / 4) : 
                                             modifiedAttributes.jumping) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Stamina:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.stamina !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.stamina / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.stamina / 4) : 
                                      modifiedAttributes.stamina}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.stamina + 
                                    (modifiedAttributes.stamina !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.stamina / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.stamina / 4) : 
                                         modifiedAttributes.stamina) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.stamina + 
                                        (modifiedAttributes.stamina !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.stamina / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.stamina / 4) : 
                                             modifiedAttributes.stamina) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Strength:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.strength !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.strength / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.strength / 4) : 
                                      modifiedAttributes.strength}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.strength + 
                                    (modifiedAttributes.strength !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.strength / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.strength / 4) : 
                                         modifiedAttributes.strength) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.strength + 
                                        (modifiedAttributes.strength !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.strength / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.strength / 4) : 
                                             modifiedAttributes.strength) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.attributeItem}>
                        <strong>Aggression:</strong>
                        <div className={styles.attributeValues}>
                            {modifiedAttributes.aggression !== undefined ? (
                                <span className={styles.modifiedAttribute}>
                                    +{selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.aggression / 2) : 
                                      selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.aggression / 4) : 
                                      modifiedAttributes.aggression}
                                </span>
                            ) : null}
                            <div style={{ backgroundColor: getAttributeColor(
                                Math.min(
                                    mainVersion.playerAttributes.aggression + 
                                    (modifiedAttributes.aggression !== undefined ? 
                                        (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.aggression / 2) : 
                                         selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.aggression / 4) : 
                                         modifiedAttributes.aggression) : 0), 
                                    99
                                )
                            ) }}>
                                <p>
                                    {Math.min(
                                        mainVersion.playerAttributes.aggression + 
                                        (modifiedAttributes.aggression !== undefined ? 
                                            (selectedChemistry === 'chemistry2' ? Math.floor(modifiedAttributes.aggression / 2) : 
                                             selectedChemistry === 'chemistry1' ? Math.floor(modifiedAttributes.aggression / 4) : 
                                             modifiedAttributes.aggression) : 0), 
                                        99
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
</div>


            {/* Chemistry Styles Grid */}
            <div className={styles.chemistryStylesSection}>

                <div className={styles.chemistrySection}>

                <div className={styles.chemistryAmount}>
            <div 
                className={`${styles.chemistry1} ${selectedChemistry === 'chemistry1' ? styles.selectedChemistry : ''}`} 
                onClick={() => handleChemistryClick('chemistry1')}
            >
                <div className={styles.chemistryGrid}>
                    <div className={styles.chemistryPoint}></div>
                    <div className={styles.chemistryPoint}></div>
                    <div className={styles.chemistryPointActive}></div>
                </div>
            </div>

            <div 
                className={`${styles.chemistry2} ${selectedChemistry === 'chemistry2' ? styles.selectedChemistry : ''}`} 
                onClick={() => handleChemistryClick('chemistry2')}
            >
                <div className={styles.chemistryGrid}>
                    <div className={styles.chemistryPointActive}></div>
                    <div className={styles.chemistryPoint}></div>
                    <div className={styles.chemistryPointActive}></div>
                </div>
            </div>

            <div 
                className={`${styles.chemistry3} ${selectedChemistry === 'chemistry3' ? styles.selectedChemistry : ''}`} 
                onClick={() => handleChemistryClick('chemistry3')}
            >
                <div className={styles.chemistryGrid}>
                    <div className={styles.chemistryPointActive}></div>
                    <div className={styles.chemistryPointActive}></div>
                    <div className={styles.chemistryPointActive}></div>
                </div>
            </div>
        </div>

</div>

<div className={styles.chemistryStylesGrid}>
                    {filteredChemistryStyles.map(style => (
                        <div 
                            key={style.name} 
                            className={`${styles.chemistryStyleItem} ${selectedStyle === style.name ? styles.selected : ''}`} 
                            onClick={() => handleChemistryStyleClick(style.name)}
                        >
                            <span>{style.name}</span> {/* Display the chemistry style name */}
                            <Image 
                                src={require(`../../../Images/chemstyles/${getChemistryStyleSVG(style.name)}`)} 
                                alt={`${style.name} icon`} 
                                width={20} 
                                height={20} 
                            />
                        </div>
    ))}
</div>
</div>
        </div>
        </div>
        </Layout>
    );
    
};

// This function gets called at build time
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    return {
        props: { playerId: id }, // Pass the player ID to the page component
    };
};

export default PlayerPage;

// Function to determine background color based on attribute value
const getAttributeColor = (value: number) => {
    if (value >= 0 && value <= 59) {
        return '#cc2921'; // Red
    } else if (value >= 60 && value <= 69) {
        return '#d15326'; // Orange
    } else if (value >= 70 && value <= 79) {
        return '#10b152'; // Light Green
    } else if (value >= 80 && value <= 99) {
        return '#119c36'; // Dark Green#00d156
    }
    return 'transparent'; // Default color if out of range
};

