import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Search from './SearchResults';
import './index.css';

const API_KEY = '3a1a1b0febe6250ae9c051ee143170f6';
const API_URL_ARTISTS = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=14`;
const API_URL_TRACKS = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=12`;

interface Image {
  '#text': string;
  size: string;
}

interface Artist {
  name: string;
  mbid?: string;
  image: Image[];
}

interface Track {
  name: string;
  mbid?: string;
  artist: string | { name: string };
  image: Image[];
}

const App: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>, loadingSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка в сети');
        const data = await response.json();
        setter(data.artists?.artist || data.tracks?.track || []);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Ошибка при загрузке данных');
      } finally {
        loadingSetter(false);
      }
    };

    fetchData(API_URL_ARTISTS, setArtists, setLoadingArtists);
    fetchData(API_URL_TRACKS, setTracks, setLoadingTracks);
  }, []);

  const getImage = (item: Artist | Track): string => {
    const imageObj = item.image.find(img => img.size === 'medium');
    return imageObj ? imageObj['#text'] : 'https://via.placeholder.com/150';
  };

  if (loadingArtists || loadingTracks) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="header-title">Музыкальный проект</h1>
          <Link to="/search">
            <span className="search-link">Поиск</span>
          </Link>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <section className="music-section">
                  <h2 className="music-section-heading">Популярные исполнители</h2>
                  <div className="music-tags">
                    {artists.map((artist) => (
                      <div key={artist.mbid || artist.name} className="music-featured-item">
                        <div className="music-featured-item-avatar artist">
                          <img src={getImage(artist)} alt={artist.name} />
                        </div>
                        <h3 className="music-featured-item-heading">{artist.name}</h3>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="music-section">
                  <h2 className="music-section-heading">Популярные треки</h2>
                  <div className="music-tags tracks">
                    {tracks.map((track) => (
                      <div key={track.mbid || track.name} className="music-featured-item track">
                        <div className="music-featured-item-avatar track">
                          <img src={getImage(track)} alt={track.name} />
                        </div>
                        <div className="music-featured-item-info">
                          <h3 className="music-featured-item-heading">{track.name}</h3>
                          <p>Исполнитель: {typeof track.artist === 'string' ? track.artist : track.artist.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            } />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <div className="footer-columns">
            <div className="footer-column">
              <h4>О компании</h4>
              <p>Наша история</p>
            </div>
            <div className="footer-column">
              <h4>Помощь</h4>
              <p>Поддержка</p>
            </div>
            <div className="footer-column">
              <h4>Аккаунты</h4>
              <p>Настройки</p>
            </div>
            <div className="footer-column">
              <h4>Следите за нами</h4>
              <p>Instagram</p>
            </div>
          </div>
          <p>© 2023 Музыкальный проект. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
