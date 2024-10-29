"use client"; // Add this line to mark the component as a Client Component

import React, { useEffect, useState } from 'react';
import Layout from '../components/layout'; // Ensure the correct import
import '../styles/globals.css'; // Import global styles
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import '../styles/homepage.css'; // Import specific styles for player grid
import { fetchPlayers, PlayerVersion } from '../lib/fetchPlayerPlural'; // Ensure correct import
import laurelLogo from '../images/logo/laurel-logo-green.png';
import laurelBG from '../images/logo/laurel-bg.png';
import searchActivityIcon from '../images/icons/search_activity.svg';
import starIcon from '../images/icons/star.svg';
import releaseAlertIcon from '../images/icons/release_alert.svg';

const PlayerGrid: React.FC = () => {
    const [allPlayers, setAllPlayers] = useState<{ [key: string]: PlayerVersion[] }>({});
    const [displayedPlayers, setDisplayedPlayers] = useState<PlayerVersion[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const apiUrls = {
        latest: 'https://api.futlaurel.com/api/25/players?latest=true',
        totw: 'https://api.futlaurel.com/api/25/players?rareType=3&latest=true',
        trailblazers: 'https://api.futlaurel.com/api/25/players?rareType=22',
    };

    const fetchAllPlayerData = async () => {
        try {
            const latestPlayers = await fetchPlayers(apiUrls.latest);
            const totwPlayers = await fetchPlayers(apiUrls.totw);
            const trailblazersPlayers = await fetchPlayers(apiUrls.trailblazers);

            setAllPlayers({
                latest: latestPlayers,
                totw: totwPlayers,
                trailblazers: trailblazersPlayers,
            });

            setDisplayedPlayers(latestPlayers); // Set initial display to latest players
        } catch (error) {
            console.error('Failed to fetch players:', error);
        }
    };

    useEffect(() => {
        fetchAllPlayerData();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filteredPlayers = displayedPlayers.filter(player =>
                player.playerCommonName && player.playerCommonName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDisplayedPlayers(filteredPlayers);
        } else {
            setDisplayedPlayers(allPlayers.latest || []);
        }
    }, [searchTerm]);

    return (
        <Layout> {/* Wrap the content with Layout */}
            <div className="logo-container">
                <img src={laurelLogo.src} alt="Laurel Logo" className="laurel-logo" />
            </div>
            <div className="bg-container">
                <img src={laurelBG.src} alt="Laurel Logo" className="laurel-bg" />
            </div>
            <div className="player-grid-container">
                <SearchBar className="searchBarHomePage"/>
                {/* You can add other components or content here */}
            </div>
            <div className="player-options-container">
            <div className="playerOptions">
                <button className="latest-cards" onClick={() => setDisplayedPlayers(allPlayers.latest || [])}>
                    Latest Cards
                </button>
                <button className="totw" onClick={() => setDisplayedPlayers(allPlayers.totw || [])}>
                    TOTW
                </button>
                <button className="latest-promo" onClick={() => setDisplayedPlayers(allPlayers.trailblazers || [])}>
                    Trailblazers
                </button>
            </div>
            </div>
            <div className="grid">
                {Array.isArray(displayedPlayers) && displayedPlayers.map((player) => (
                    <a key={player.playerResourceId} href={`/players/${player.playerResourceId}`} className="player-card">
                        <img 
                            src={player.playerCardImages.enNoLaurelBig} 
                            alt={player.playerCommonName || `${player.playerFirstName} ${player.playerLastName}`} 
                            loading="lazy"
                            srcSet={`${player.playerCardImages.enNoLaurelBig} 1x, ${player.playerCardImages.enNoLaurelBig.replace('.jpg', '@2x.jpg')} 2x`}
                        /> 
                    </a>
                ))}
            </div>
        </Layout>
    );
};

export default PlayerGrid;
