'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    apiUrl: '',
    apiKey: ''
  });
  const [showSettings, setShowSettings] = useState(false);

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('apiSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setShowSettings(false);
    } else {
      setShowSettings(true);
      setLoading(false);
    }
  }, []);

  // 保存设置
  const saveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('apiSettings', JSON.stringify(settings));
    setShowSettings(false);
    fetchShow();
  };

  const fetchShow = async () => {
    if (!settings.apiUrl || !settings.apiKey) {
      setShowSettings(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      setShow(JSON.parse(data));
      setError(null);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings.apiUrl && settings.apiKey) {
      fetchShow();
    }
  }, [settings.apiUrl, settings.apiKey]);

  // 复制到剪贴板
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // 可以添加一个提示，表示复制成功
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (showSettings) {
    return (
      <div className={styles.settingsContainer}>
        <form onSubmit={saveSettings} className={styles.settingsForm}>
          <h2>API Settings</h2>
          <div className={styles.formGroup}>
            <label htmlFor="apiUrl">API URL:</label>
            <input
              type="url"
              id="apiUrl"
              value={settings.apiUrl}
              onChange={(e) => setSettings(prev => ({...prev, apiUrl: e.target.value}))}
              required
              placeholder="https://example.com/v1/chat/completions"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="apiKey">API Key:</label>
            <input
              type="password"
              id="apiKey"
              value={settings.apiKey}
              onChange={(e) => setSettings(prev => ({...prev, apiKey: e.target.value}))}
              required
              placeholder="Enter your API key"
            />
          </div>
          <button type="submit" className={styles.saveButton}>Save Settings</button>
        </form>
      </div>
    );
  }

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

  if (error) return (
    <main className={styles.main}>
      <div className={styles.showCard}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={fetchShow} 
            className={styles.refreshButton}
          >
            Try Again
          </button>
          <button 
            onClick={() => setShowSettings(true)} 
            className={`${styles.refreshButton} ${styles.settingsButton}`}
          >
            Check Settings
          </button>
        </div>
      </div>
    </main>
  );

  if (!show) return null;

  return (
    <main className={styles.main}>
      <div className={styles.showCard}>
        <div className={styles.settingsIcon} onClick={() => setShowSettings(true)}>
          ⚙️
        </div>
        <h1>{show.title} ({show.year})</h1>
        <p className={styles.description}>{show.description}</p>
        
        <div className={styles.charactersSection}>
          <h2>Characters</h2>
          <div className={styles.characterGrid}>
            {show.characters.map((character, index) => (
              <div 
                key={index} 
                className={styles.characterCard}
                onClick={() => copyToClipboard(character)}
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
