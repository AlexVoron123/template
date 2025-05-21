import React, { useEffect, useState } from 'react';

const API_KEY = '3a1a1b0febe6250ae9c051ee143170f6';
const API_URL_ARTISTS = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=10`;
const API_URL_TRACKS = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=10`;

function App() {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(API_URL_ARTISTS);
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        const data = await response.json();
        console.log(data);
        setArtists(data.artists.artist);
      } catch (err) {
        setError('Ошибка при загрузке данных исполнителей');
      } finally {
        setLoadingArtists(false);
      }
    };

    const fetchTracks = async () => {
      try {
        const response = await fetch(API_URL_TRACKS);
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        const data = await response.json();
        setTracks(data.tracks.track);
      } catch (err) {
        setError('Ошибка при загрузке данных треков');
      } finally {
        setLoadingTracks(false);
      }
    };

    fetchArtists();
    fetchTracks();
  }, []);

  if (loadingArtists || loadingTracks) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <header>
        <h1>Музыкальный проект</h1>
        <input type="text" placeholder="Поиск..." />
      </header>

      <main>
        <section className="popular-artists">
          <h2>Популярные исполнители</h2>
          <div className="artist-container">
            {artists.map((artist: any) => (
              <div className="artist" key={artist.mbid || artist.name}>
                <div
                  className="artist-image"
                  style={{ backgroundImage: `url(${artist.image.find((img: any) => img.size === 'medium')['#text']})` }}
                ></div>
                <p>{artist.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="popular-tracks">
          <h2>Популярные треки</h2>
          <div className="track-container">
            {tracks.map((track: any) => (
              <div className="track" key={track.mbid || track.name}>
                 <div
                  className="track-image"
                  style={{ backgroundImage: `url(${track.image.find((img: any) => img.size === 'medium')['#text']})` }}
                ></div>
                <p>{track.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>Ссылки будут здесь</p>
      </footer>
    </div>
  );
}

export default App;
