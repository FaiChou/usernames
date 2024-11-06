'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import movies from './movies.json';
import tvs from './tvs.json';

export default function Home() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomShow = () => {
    const allShows = [...movies, ...tvs];
    const randomIndex = Math.floor(Math.random() * allShows.length);
    const selectedShow = allShows[randomIndex];
    
    return {
      title: selectedShow.title,
      description: selectedShow.overview,
      characters: selectedShow.cast.slice(0, 10), // 只取前10个角色
      type: movies.includes(selectedShow) ? 'Movie' : 'TV Show'
    };
  };

  const fetchShow = () => {
    setLoading(true);
    setTimeout(() => {
      const randomShow = getRandomShow();
      setShow(randomShow);
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    fetchShow();
  }, []);

  if (loading) return (
    <main className={styles.main}>
      <div className={styles.showCard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Generating content...</p>
        </div>
      </div>
    </main>
  );

  if (!show) return null;

  return (
    <main className={styles.main}>
      <div className={styles.showCard}>
        <div className={styles.titleContainer}>
          <h1>{show.title}</h1>
          <span className={`${styles.badge} ${show.type === 'Movie' ? styles.movieBadge : styles.tvBadge}`}>
            {show.type}
          </span>
        </div>
        <p className={styles.description}>{show.description}</p>
        
        <div className={styles.charactersSection}>
          <h2>Characters</h2>
          <div className={styles.characterGrid}>
            {show.characters.map((character, index) => (
              <div 
                key={index} 
                className={styles.characterCard}
                onClick={() => navigator.clipboard.writeText(character)}
                title="Click to copy"
              >
                {character}
              </div>
            ))}
          </div>
        </div>

        <button onClick={fetchShow} className={styles.refreshButton}>
          Generate New Show
        </button>
      </div>
    </main>
  );
}
