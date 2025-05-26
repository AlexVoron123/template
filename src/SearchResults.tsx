import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = '3a1a1b0febe6250ae9c051ee143170f6';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const navigate = useNavigate();
  const query = useQuery().get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState<'best' | 'artists' | 'tracks' | 'albums'>('best');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  const performSearch = async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const artistResp = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(term)}&api_key=${API_KEY}&format=json&limit=14`
      );
      if (!artistResp.ok) throw new Error('Ошибка сети');
      const artistData = await artistResp.json();
      setArtists(artistData.results.artistmatches.artist || []);

      const trackResp = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(term)}&api_key=${API_KEY}&format=json&limit=12`
      );
      if (!trackResp.ok) throw new Error('Ошибка сети');
      const trackData = await trackResp.json();
      setTracks(trackData.results.trackmatches.track || []);

      const albumResp = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(term)}&api_key=${API_KEY}&format=json&limit=18`
      );
      if (!albumResp.ok) throw new Error('Ошибка сети');
      const albumData = await albumResp.json();
      setAlbums(albumData.results.albummatches.album || []);
    } catch (e) {
      setError('Ошибка при поиске');
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      performSearch(searchTerm.trim());
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Результаты поиска</h1>
        <div className="search-wrapper">
          <button onClick={() => navigate('/')}>← Назад</button>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit();
              }
            }}
          />
          <button onClick={onSearchSubmit}>Поиск</button>
        </div>
        <nav className="tabs">
          <button
            className={activeTab === 'best' ? 'active' : ''}
            onClick={() => setActiveTab('best')}
          >
            Лучший поиск
          </button>
          <button
            className={activeTab === 'artists' ? 'active' : ''}
            onClick={() => setActiveTab('artists')}
          >
            Артисты
          </button>
          <button
            className={activeTab === 'tracks' ? 'active' : ''}
            onClick={() => setActiveTab('tracks')}
          >
            Треки
          </button>
          <button
            className={activeTab === 'albums' ? 'active' : ''}
            onClick={() => setActiveTab('albums')}
          >
            Альбомы
          </button>
        </nav>
      </header>

      <main>
        {loading && <div>Загрузка...</div>}
        {error && <div>{error}</div>}

        {!loading && !error && (
          <>
            {activeTab === 'best' && (
              <>
                <section>
                  <h2>Артисты</h2>
                  {artists.length ? (
                    <div className="artist-container">
                      {artists.map((artist: any, index: number) => {
                        const imageObj = artist.image.find((img: any) => img.size === 'medium');
                        const imageUrl = imageObj ? imageObj['#text'] : '';
                        return (
                          <div className="artist" key={`${artist.mbid || artist.name}-${index}`}>
                            <div
                              className="artist-image"
                              style={{ backgroundImage: `url(${imageUrl})` }}
                            ></div>
                            <p>{artist.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Артисты не найдены</p>
                  )}
                </section>

                <section>
                  <h2>Треки</h2>
                  {tracks.length ? (
                    <div className="track-container">
                      {tracks.map((track: any, index: number) => {
                        const imageObj = track.image.find((img: any) => img.size === 'medium');
                        const imageUrl = imageObj ? imageObj['#text'] : '';
                        return (
                          <div className="track" key={`${track.mbid || track.name}-${index}`}>
                            <div
                              className="track-image"
                              style={{ backgroundImage: `url(${imageUrl})` }}
                            ></div>
                            <div className="track-info">
                              <p className="track-name">{track.name}</p>
                              <p className="track-artist">{track.artist.name || track.artist}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Треки не найдены</p>
                  )}
                </section>

                <section>
                  <h2>Альбомы</h2>
                  {albums.length ? (
                    <div className="album-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {albums.map((album: any, index: number) => {
                        const imageObj = album.image.find((img: any) => img.size === 'medium');
                        const imageUrl = imageObj ? imageObj['#text'] : '';
                        return (
                          <div className="album" key={`${album.mbid || album.name}-${index}`}>
                            <div
                              className="album-image"
                              style={{ backgroundImage: `url(${imageUrl})` }}
                            ></div>
                            <div className="album-info">
                              <p className="album-name">{album.name}</p>
                              <p className="album-artist">{album.artist.name || album.artist}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Альбомы не найдены</p>
                  )}
                </section>
              </>
            )}

            {activeTab === 'artists' && (
              <section>
                <h2>Артисты</h2>
                {artists.length ? (
                  <div className="artist-container">
                    {artists.map((artist: any, index: number) => {
                      const imageObj = artist.image.find((img: any) => img.size === 'medium');
                      const imageUrl = imageObj ? imageObj['#text'] : '';
                      return (
                        <div className="artist" key={`${artist.mbid || artist.name}-${index}`}>
                          <div
                            className="artist-image"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          ></div>
                          <p>{artist.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>Артисты не найдены</p>
                )}
              </section>
            )}

            {activeTab === 'tracks' && (
              <section>
                <h2>Треки</h2>
                {tracks.length ? (
                  <div className="track-container">
                    {tracks.map((track: any, index: number) => {
                      const imageObj = track.image.find((img: any) => img.size === 'medium');
                      const imageUrl = imageObj ? imageObj['#text'] : '';
                      return (
                        <div className="track" key={`${track.mbid || track.name}-${index}`}>
                          <div
                            className="track-image"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          ></div>
                          <div className="track-info">
                            <p className="track-name">{track.name}</p>
                            <p className="track-artist">{track.artist.name || track.artist}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>Треки не найдены</p>
                )}
              </section>
            )}

            {activeTab === 'albums' && (
              <section>
                <h2>Альбомы</h2>
                {albums.length ? (
                  <div className="album-container">
                    {albums.map((album: any, index: number) => {
                      const imageObj = album.image.find((img: any) => img.size === 'medium');
                      const imageUrl = imageObj ? imageObj['#text'] : '';
                      return (
                        <div className="album" key={`${album.mbid || album.name}-${index}`}>
                          <div
                            className="album-image"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          ></div>
                          <div className="album-info">
                            <p className="album-name">{album.name}</p>
                            <p className="album-artist">{album.artist.name || album.artist}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>Альбомы не найдены</p>
                )}
              </section>
            )}
          </>
        )}
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
  );
};

export default SearchResults;
