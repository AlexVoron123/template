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
 /**
 * Загружает данные с указанного API URL и обновляет состояние.
 *
 * @param url - URL API для загрузки данных.
 * @param setter - Функция-сеттер состояния для обновления данных.
 * @param loadingSetter - Функция-сеттер состояния для обновления статуса загрузки.
 */
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

/**
 * Получает URL изображения для исполнителя или трека.
 *
 * @param item - Объект исполнителя или трека.
 * @returns URL изображения или URL по умолчанию.
 */
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
        <header>
          <h1>Музыкальный проект</h1>
          <Link to="/search">
            <span className="search-link">Поиск</span>
          </Link>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <section className="music-section">
                  <h2>Популярные исполнители</h2>
                  <div className="artist-container">
                    {artists.map((artist) => (
                      <div key={artist.mbid || artist.name} className="artist">
                        <div className="artist-image" style={{ backgroundImage: `url(${getImage(artist)})` }}></div>
                        <p>{artist.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="music-section">
                  <h2>Популярные треки</h2>
                  <div className="track-container">
                    {tracks.map((track) => (
                      <div key={track.mbid || track.name} className="track">
                        <div className="track-image" style={{ backgroundImage: `url(${getImage(track)})` }}></div>
                        <div className="track-info">
                          <p className="track-name">{track.name}</p>
                          <p className="track-artist">Исполнитель: {typeof track.artist === 'string' ? track.artist : track.artist.name}</p>
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
        <footer className="footer">
        <div className="footer-column">
          <h3>О компании</h3>
          <ul>
            <li>Наша история</li>
            <li>Команда</li>
            <li>Контакты</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Помощь</h3>
          <ul>
            <li>Частые вопросы</li>
            <li>Поддержка</li>
            <li>Обратная связь</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Аккаунты</h3>
          <ul>
            <li>Вход</li>
            <li>Регистрация</li>
            <li>Настройки</li>
          </ul>
        </div>
      </footer>
      </div>
    </Router>
  );
};

export default App;
