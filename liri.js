require("dotenv").config()
const keys = require("./keys.js")
const moment = require("moment")
const axios = require("axios")
const fs = require("fs")
const Spotify = require("node-spotify-api")
const spotifyApi = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
})

const goodCommands = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'];
let theCommand = process.argv[2]
let theArgument = process.argv[3]

const getMeSpotify = songName => {
    if (!songName) songName = "The Sign"
    let spotifySearch = {}
    spotifySearch.type = 'track'
    spotifySearch.query = songName
    spotifyApi.search(spotifySearch, (err, data) => {
        if (err) return console.log('Error occurred: ' + err)
        data.tracks.items.forEach(element => {
            console.log(`Artist: ${element.artists[0].name}`)
            console.log(`Song Name ${element.name}`)
            console.log(`Album Name ${element.album.name}`)
            console.log(`Preview URL: ${element.external_urls.spotify}`)
            console.log('===============================================')
        })
    })
}

const getMeConcert = artistName => {
    let theURL = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp&date=upcoming`
    axios.get(theURL)
        .then(results => {
            results.data.forEach(element => {
                console.log(`Venue Name: ${element.venue.name}`)
                console.log(`Venue Location: ${element.venue.city}, ${element.venue.region}`)
                console.log(`Concert Date: ${moment(element.datetime).format('MM/DD/YYYY')}`)
                console.log('===============================================')
            })
        })
}

const getMeMovie = movieName => {
    if (!movieName) movieName = 'Mr Nobody'
    axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movieName}`)
        .then(results => {
            console.log(`Title: ${results.data.Title}`)
            console.log(`Year: ${results.data.Year}`)
            console.log(`IMDB Rating: ${results.data.Ratings[0].Value}`)  // IMDB
            console.log(`Rotten Tomatoes Rating: ${results.data.Ratings[2].Value}`)  // Rotten Tomatoes
            console.log(`Country: ${results.data.Country}`)
            console.log(`Language: ${results.data.Language}`)
            console.log(`Plot: ${results.data.Plot}`)
            console.log(`Actors ${results.data.Actors}`)
        })
}

const doRandom = () => {
    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) return console.log(error.code);
        let stuff = data.split(",")
        switch (stuff[0]) {
            case 'concert-this': 
                getMeConcert(stuff[1])
                break
            case 'spotify-this-song':
                getMeSpotify(stuff[1])
                break
            case 'movie-this':
                getMeMovie(stuff[1])
                break
            default:
                console.log("Ooops. Something went wrong.") }
      });
}

if (goodCommands.includes(theCommand)) {
    switch (theCommand) {
        case 'concert-this': 
            getMeConcert(theArgument)
            break
        case 'spotify-this-song':
            getMeSpotify(theArgument)
            break
        case 'movie-this':
            getMeMovie(theArgument)
            break
        case 'do-what-it-says':
            doRandom()
            break
        default :
            console.log('Ooops. Something went wrong.')
            break
    }
}