const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// ==============================
// ENTIDAD: Usuarios
// ==============================
let users = [];

function initUsers() {
    users.push({
        id: 1,
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
    });

    for (let i = 0; i < 10; i++) {
        users.push({
            id: i + 2,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'user'
        });
    }
}

app.get('/users', (req, res) => res.json(users));
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    user ? res.json(user) : res.sendStatus(404);
});
app.post('/users', (req, res) => {
    const user = { ...req.body, id: users.length + 1 };
    users.push(user);
    res.status(201).json(user);
});
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        Object.assign(user, req.body);
        res.json(user);
    } else res.sendStatus(404);
});
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const exists = users.some(u => u.id === id);
    exists ? (users = users.filter(u => u.id !== id), res.sendStatus(204)) : res.sendStatus(404);
});

// ==============================
// ENTIDAD: Artistas
// ==============================
let artists = [];

function initArtists() {
    for (let i = 0; i < 5; i++) {
        artists.push({
            id: i + 1,
            name: faker.music.artist(),
            genre: faker.music.genre(),
            country: faker.location.country(),
            image: faker.image.url()
        });
    }
}

app.get('/artists', (req, res) => res.json(artists));
app.get('/artists/:id', (req, res) => {
    const artist = artists.find(a => a.id === parseInt(req.params.id));
    artist ? res.json(artist) : res.sendStatus(404);
});
app.post('/artists', (req, res) => {
    const artist = { ...req.body, id: artists.length + 1 };
    artists.push(artist);
    res.status(201).json(artist);
});
app.put('/artists/:id', (req, res) => {
    const artist = artists.find(a => a.id === parseInt(req.params.id));
    if (artist) {
        Object.assign(artist, req.body);
        res.json(artist);
    } else res.sendStatus(404);
});
app.delete('/artists/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const exists = artists.some(a => a.id === id);
    exists ? (artists = artists.filter(a => a.id !== id), res.sendStatus(204)) : res.sendStatus(404);
});

// ==============================
// ENTIDAD: Álbumes
// ==============================
let albums = [];

function initAlbums() {
    for (let i = 0; i < 10; i++) {
        albums.push({
            id: i + 1,
            title: faker.music.album(),
            year: faker.date.past({ years: 20 }).getFullYear(),
            artistId: faker.helpers.arrayElement(artists).id,
            image: faker.image.url()
        });
    }
}

app.get('/albums', (req, res) => res.json(albums));
app.get('/albums/:id', (req, res) => {
    const album = albums.find(a => a.id === parseInt(req.params.id));
    album ? res.json(album) : res.sendStatus(404);
});
app.post('/albums', (req, res) => {
    const album = { ...req.body, id: albums.length + 1 };
    albums.push(album);
    res.status(201).json(album);
});
app.put('/albums/:id', (req, res) => {
    const album = albums.find(a => a.id === parseInt(req.params.id));
    if (album) {
        Object.assign(album, req.body);
        res.json(album);
    } else res.sendStatus(404);
});
app.delete('/albums/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const exists = albums.some(a => a.id === id);
    exists ? (albums = albums.filter(a => a.id !== id), res.sendStatus(204)) : res.sendStatus(404);
});

// ==============================
// ENTIDAD: Canciones
// ==============================
let songs = [];
async function getSong(name) {
    console.log(`https://api.deezer.com/search?q=${encodeURIComponent(name)}`)
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(name)}`);
    const data = await res.json();
    const song = data.data[0];
    return song.preview
}

async function initSongs() {
    for (let i = 0; i < 20; i++) {
        const name = faker.music.songName()

        songs.push({
            id: i + 1,
            title: name,
            duration: faker.number.int({ min: 120, max: 300 }), // segundos
            albumId: faker.helpers.arrayElement(albums).id,
            audio: await getSong(name)

        });
    }
}

app.get('/songs', (req, res) => res.json(songs));
app.get('/songs/:id', (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    song ? res.json(song) : res.sendStatus(404);
});
app.post('/songs', async (req, res) => {
    const song = { ...req.body, id: songs.length + 1, audio:await getSong(req.body.title)};
    songs.push(song);
    res.status(201).json(song);
});
app.put('/songs/:id', (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    if (song) {
        Object.assign(song, req.body);
        res.json(song);
    } else res.sendStatus(404);
});
app.delete('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const exists = songs.some(s => s.id === id);
    exists ? (songs = songs.filter(s => s.id !== id), res.sendStatus(204)) : res.sendStatus(404);
});

// ==============================
// INICIALIZACIÓN Y ARRANQUE
// ==============================
app.get('/', (req, res) => res.send('🎶 Music Manager API'));

app.get('/search', (req, res) => {
    const q = req.query.q.toLowerCase();
    const artist = artists.filter(a => a.name.toLowerCase().includes(q) || q === null).map(function (artist) {
        return {
            id: artist.id,
            name: artist.name,
            tag: "artists"
        };
    });
    const album = albums.filter(a => a.title.toLowerCase().includes(q) || q === null).map(function (album) {
        return {
            id: album.id,
            name: album.title,
            tag: "album"
        };
    });
    const song = songs.filter(a => a.title.toLowerCase().includes(q) || q === null).map(function (song) {
        return {
            id: song.albumId,
            name: song.title,
            tag: "song"
        };
    });
    const all = artist.concat(album).concat(song);
    all ? res.json(all) : res.sendStatus(404);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Simula token de sesión (puedes poner un JWT si quieres)
    const token = 'FAKE-TOKEN-123';

    return res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});


app.listen(port, () => {
    initUsers();
    initArtists();
    initAlbums();
    initSongs();
    console.log(`Music Manager API running on http://localhost:${port}`);
});
