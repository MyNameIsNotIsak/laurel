import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { fetchPlayers, PlayerVersion, PlayerClub, PlayerLeague, PlayerNation } from '../lib/fetchPlayerPlural';

// Define the props interface to include the style and className props
interface SearchBarProps {
    style?: React.CSSProperties;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ style, className }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<PlayerVersion[]>([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const fetchPlayerData = async (query: string) => {
            const apiUrl = `https://api.futlaurel.com/api/25/players?name=${query}`;
            try {
                const playerData = await fetchPlayers(apiUrl);
                setSearchResults(playerData);
            } catch (error) {
                console.error('Failed to fetch players:', error);
            }
        };

        if (debouncedSearchTerm) {
            fetchPlayerData(debouncedSearchTerm);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsPopupVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputFocus = () => {
        setIsPopupVisible(true);
    };

    const styles: { [key: string]: CSSProperties } = {
        input: {
            width: '100%',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '16px',
            padding: '15px',
            backgroundColor: 'var(--dark)',
            height: '40px',
        },
        searchResultsPopup: {
            position: 'absolute',
            left: '0',
            right: '0',
            backgroundColor: 'var(--black)',
            border: '1px solid var(--border)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1,
            borderRadius: '12px',
            width: '100%', // Ensure it takes the full width of the parent
            padding: '10px',
        },
        searchResultItem: {
            borderRadius: '8px',
            marginBottom: '10px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            maxHeight: '70px',
            backgroundColor: 'var(--dark)',
            overflow: 'hidden',
            zIndex: 1,
        },
        searchResultContent: {
            display: 'flex',  
            justifyContent: 'space-between',
            gap: '20px',
            width: '100%',
            height: '70px',
            zIndex: 1,
        },
        searchResultImageContainer: {
            width: 'fit-content',
            height: 'fit-content',
            zIndex: 1,
        },
        searchResultImage: {
            marginLeft: '-30px',
            marginTop: '-30px',
            position: 'absolute',
            height: '180px',
            zIndex: 1,
        },
        playerPortraitImage: {
            marginLeft: '0',
            marginTop: '0',
            position: 'absolute',
            height: '70px',
            zIndex: 1,
        },
        searchResultInfo: {
            height: '100%',
            width: 'fit-content',
            display: 'grid',
            alignItems: 'center',
            justifyContent: 'center',
            textWrap: 'nowrap',
            zIndex: 1,
        },
        searchResultName: {
            fontSize: '1.5em',
            fontWeight: 'bold',
            color: 'white',
            marginLeft: '75px',
            zIndex: 1,
        },
        playerCommonName: {
            color: 'var(--blue)', // Match the color of lastName
            zIndex: 1,
        },
        searchResultLink: {
            width: '100%',
            zIndex: 1,
        },
        firstName: {
            fontWeight: 500,
            fontSize: '0.7em',
            color: 'var(--AccentText)',
            lineHeight: 1,
            display: 'block',
            zIndex: 1,
        },
        lastName: {
            color: 'var(--blue)',
            lineHeight: 0.7,
            display: 'block',
            zIndex: 1,
        },
        searchResultBackground: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: -1, // Ensure it's behind other elements
        },
        rarityImage: {
            position: 'absolute',
            height: '600%',
            right: '-50px',
            top: '-200%',
            maskImage: 'linear-gradient(to right, transparent 5%, rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.7) 50%, black 80%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 12%, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0.35) 80%, black 100%)',
            zIndex: 1,
        },
        searchResultRatingContainer: {
            height: '100%',
            display: 'grid',
            alignItems: 'center',
            justifyContent: 'end',
            zIndex: 1,
            fontWeight: 'bold',
            width: '100%',
        },
        searchResultRating: {
            textAlign: 'center',
            fontSize: '3em',
            fontWeight: 600,
            fontFamily: 'CruyffSansCondensed',
            color: 'white',
            marginRight: '10px',
            zIndex: 1,
        },
        additionalImagesContainerContainer: {
            position: 'relative',
            height: '70px',
            width: '100%',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            zIndex: 0,
        },
        additionalImagesContainer: {
            display: 'grid',
            gridTemplateColumns: 'auto 1fr', // Two columns
            gridTemplateRows: 'auto auto', // Two rows
            gap: '5px',
            alignItems: 'center',
            zIndex: 0,
        },
        clubImage: {
          gridColumn: '1 / 2', // First column
            gridRow: '2 / 3', // Second row
            
            width: '25px', // Larger width
            height: 'fit-content',
            zIndex: 1,
        },
        leagueImage: {
            gridColumn: '1 / 3', // First column
            gridRow: '1 / 2', // First row
            width: '25px',
            height: 'fit-content',
            zIndex: 1,
        },
        nationImageContainer: {
            position: 'absolute',
            top: '0',
            width: '100%',
            alignItems: 'center',
        },
        nationImage: {
            position: 'relative',
            height: '70px',
            width: 'fit-content',
            zIndex: -20, // Ensure it's behind other elements
            maskImage: 'linear-gradient(to left, transparent 0%, rgba(0, 0, 0, 0.5) 50%, black 100%)', // Smoother gradient
            WebkitMaskImage: 'linear-gradient(to left, transparent 0%, rgba(0, 0, 0, 0.15) 30%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.5) 80%, black 100%)', // For WebKit browsers
            opacity: 0.2,
        },
        leagueImageCentered: {
            gridColumn: '1 / 3', // Span both columns
            gridRow: '1 / 2', // First row
            width: '25px',
            height: 'fit-content',
            zIndex: 1,
            justifySelf: 'center', // Center the league image
        },
    };

    return (
        <div ref={searchBarRef} className={`${className}`} style={{ position: 'relative', ...style }}>
            <div className="searchBar" style={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search for a player..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleInputFocus}
                    style={styles.input}
                />
            </div>
            {isPopupVisible && searchResults.length > 0 && (
                <div style={styles.searchResultsPopup}>
                    {searchResults.map((player) => (
                        <div key={player.playerResourceId} style={styles.searchResultItem}>
                            <a href={`/players/${player.playerResourceId}`} style={styles.searchResultLink}>
                                <div style={styles.searchResultContent}>
                                    <div style={styles.searchResultImageContainer}>
                                        <img 
                                            src={player.hasDynamic ? player.playerDynamicImage || player.playerPortraitImage : player.playerPortraitImage} 
                                            alt={player.playerCommonName || `${player.playerFirstName} ${player.playerLastName}`} 
                                            style={player.hasDynamic ? styles.searchResultImage : styles.playerPortraitImage}
                                        />
                                    </div>
                                    <div style={styles.searchResultInfo}>
                                        <p style={styles.searchResultName}>
                                            {player.playerCommonName ? (
                                                <span style={styles.playerCommonName}>{player.playerCommonName}</span>
                                            ) : (
                                                <>
                                                    <span style={styles.firstName}>{player.playerFirstName}</span> <span style={styles.lastName}>{player.playerLastName}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div style={styles.additionalImagesContainerContainer}>
                                        <div style={styles.additionalImagesContainer}>
                                            {player.playerClub.clubNameEn !== "ICON" && (
                                                <img 
                                                    src={player.playerClub.clubImages.dark} 
                                                    alt={`Club: ${player.playerClub.clubNameEn}`} 
                                                    style={styles.clubImage}
                                                />
                                            )}
                                            <img 
                                                src={player.playerLeague.leagueImages.dark} 
                                                alt={`League: ${player.playerLeague.leagueNameEn}`} 
                                                style={player.playerClub.clubNameEn === "ICON" ? styles.leagueImageCentered : styles.leagueImage}
                                            />
                                        </div>
                                    </div>
                                    <div style={styles.searchResultBackground}>
                                        <img 
                                            src={player.playerRarity.rarityCardImages.big}
                                            alt={`Rarity: ${player.playerRarity.rarityNameEn}`}
                                            style={styles.rarityImage}
                                        />
                                    </div>
                                    <div style={styles.searchResultRatingContainer}>
                                        <p style={styles.searchResultRating}>{player.playerRating}</p>
                                    </div>
                                    
                                </div>
                                <div style={styles.nationImageContainer}>
                                        <img 
                                            src={player.playerNation.nationImage} 
                                            alt={`Nation: ${player.playerNation.nationNameEn}`} 
                                            style={styles.nationImage}
                                        />
                                        </div>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
