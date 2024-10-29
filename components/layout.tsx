// components/Layout.tsx
import React, { ReactNode, useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import styles from './Layout.module.css'; // Import your styles
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import Link from 'next/link'; // Import Link from next/link

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerContent}>
                        <Link href="/" passHref>
                            <Image 
                                src={require('../Images/logo/laurel-logo-green.png')}
                                alt="logo"
                                width={100}
                                height={20}
                                className={styles.logo}
                            />
                        </Link>
                        <div className={styles.menuIcon} onClick={toggleMenu}>
                           <p>☰</p>
                        </div>
                        <div className={styles.searchIcon} onClick={toggleSearch}>
                            <p>⌕</p>
                        </div>
                    </div>
                    <nav className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ''}`}>
                        <Link href="/players" passHref>
                            <span className={styles.playersLink}>
                                Players
                            </span>
                        </Link>
                        {/* Add more links as needed */}
                    </nav>
                    {isSearchOpen && (
                        <div className={styles.searchBarContainer}>
                        <div className={styles.searchBarPopup}>
                            <SearchBar className={styles.searchBarHeader} />
                        </div>
                        </div>
                    )}
                </div>
            </header>
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                <p>Global Footer</p>
            </footer>
        </div>
    );
};

export default Layout;
