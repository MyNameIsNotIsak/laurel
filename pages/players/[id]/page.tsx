import { useEffect, useState } from 'react';

interface Player {
    playerId: string;
    playerCommonName: string;
    playerFirstName: string;
    playerLastName: string;
    playerRating: number;
    playerMainPos: string;
    playerHeight: number;
    playerClub: { clubNameEn: string };
    playerLeague: { leagueNameEn: string };
    playerNation: { nationNameEn: string };
    playerPortraitImage: string;
    playerRolesPlus?: string[];
}

const PlayerPage = ({ params }: { params: { id: string } }) => {
    const { id } = params; // Get the player ID from the URL
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`https://api.futlaurel.com/api/25/players/${id}`);
                const data: Player = await response.json();
                setPlayer(data);
            } catch (error) {
                console.error("Error fetching player data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!player) return <p>Player not found.</p>;

    return (
        <div>
            <h1>{player.playerCommonName || `${player.playerFirstName} ${player.playerLastName}`}</h1>
            <img src={player.playerPortraitImage} alt={player.playerCommonName} />
            <p>Rating: {player.playerRating}</p>
            <p>Position: {player.playerMainPos}</p>
            <p>Height: {player.playerHeight} cm</p>
            <p>Club: {player.playerClub.clubNameEn}</p>
            <p>League: {player.playerLeague.leagueNameEn}</p>
            <p>Nationality: {player.playerNation.nationNameEn}</p>
            <p>Roles: {player.playerRolesPlus ? player.playerRolesPlus.join(', ') : 'None'}</p>
        </div>
    );
};

export default PlayerPage;

