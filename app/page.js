'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import movies from './movies.json';
import tvs from './tvs.json';

export default function Home() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomShow = () => {
    // 合并电影和电视剧数据
    const allShows = [...movies, ...tvs];
    // 随机选择一个节目
    const randomIndex = Math.floor(Math.random() * allShows.length);
    const selectedShow = allShows[randomIndex];
    
    // 转换成之前的数据格式
    return {
      title: selectedShow.title,
      year: selectedShow.title.match(/\((\d{4})\)/) ? selectedShow.title.match(/\((\d{4})\)/)[1] : "N/A",
      description: selectedShow.overview,
      characters: selectedShow.cast.slice(0, 10) // 只取前10个角色
    };
  };

  const fetchShow = () => {
    setLoading(true);
    // 模拟异步加载
    setTimeout(() => {
      const randomShow = getRandomShow();
      setShow(randomShow);
      setLoading(false);
    }, 500);
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
        <h1>{show.title} ({show.year})</h1>
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
