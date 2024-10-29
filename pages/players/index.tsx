// Import your layout component
import Layout from '../../components/layout';
import '../../app/globals.css'; // Import global styles
import React, { useEffect, useState } from 'react';
import { fetchPlayers, PlayerVersion } from '../../lib/fetchPlayerPlural'; // Import the fetchPlayers function
import Link from 'next/link'; // Import the Link component
import { useRouter } from 'next/router'; // Import useRouter
// ... existing code ...
import styles from '../../styles/PlayersPage.module.css';

// Wrap your page component with the Layout component
const PlayersPage: React.FC = () => {
    const router = useRouter();
    const [players, setPlayers] = useState<PlayerVersion[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        // Read the initial page from the URL query
        const initialPage = parseInt(router.query.page as string, 10) || 0;
        setPage(initialPage);
    }, [router.query.page]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.futlaurel.com/api/25/players?page=${page}`);
                const data = await response.json();
                setPlayers(data.players);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to fetch players:', error);
            }
        };

        fetchData();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        // Update the URL with the new page number
        router.push(`/players?page=${newPage}`, undefined, { shallow: true });
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <div className={styles.playerGrid}>
                        {players.map((player) => (
                            <div key={player.playerResourceId} className={styles.playerCard}>
                                <Link href={`/players/${player.playerResourceId}`}>
                                    <img 
                                        src={player.playerCardImages.enNoLaurelBig} 
                                        alt={player.playerCommonName || `${player.playerFirstName} ${player.playerLastName}`} 
                                        loading="lazy"
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.rightSection}>
                    {/* Additional content for the right section */}
                    <h2>Additional Information</h2>
                    <p>Details about selected player or other content...</p>
                </div>
            </div>
            <div className={styles.pagination}>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                    Next
                </button>
            </div>
        </Layout>
    );
};

export default PlayersPage;

// ... existing code ...
