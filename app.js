

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', async (req, res) => {
  res.render('home');
});

app.get('/artist-search', async (req, res) => {
  //query param, what is a query ?
  let artistName = req.query.theArtistsName;
  let result = await spotifyApi.searchArtists(artistName);
  let artists = result.body.artists.items;
  artists.forEach((artist) => {
    console.log(artist);
  });
    res.render('artist-search-results', { artists: result.body.artists.items});
});

app.get('/albums/:artistId', async (req, res) => {
  let artistId = req.params.artistId;
  let result = await spotifyApi.getArtistAlbums(artistId);
  let albums = result.body.items;
  res.render('albums', {albums});
});

app.get('/tracks/:albumId/', async (req,res) => {
  let albumId = req.params.albumId;
  let result = await spotifyApi.getAlbumTracks(albumId);
  //console.log(result);
  let tracks = result.body.items;
  console.log(tracks);
  res.render('tracks', {tracks});
});


app.listen(8080, () => console.log('My Spotify project running on port 8080 🎧 🥁 🎸 🔊'));
