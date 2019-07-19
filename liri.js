require("dotenv").config();
const keys = require("./keys.js");
const moment = require("moment")
const axios = require("axios")

const goodCommands = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'];

let theCommand = process.argv[2]
let theArgument = process.argv[3]

const getMeSpotify = songName => {
    console.log(`spotify thingy ${songName}`)
}

const getMeConcert = artistName => {
    let theURL = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp&date=upcoming`
    axios.get(theURL)
        .then(results => {
            results.data.forEach(element => {
                console.log(element.venue.name)
                console.log(element.venue.city + ", " + element.venue.region)
                console.log(moment(element.datetime).format('MM/DD/YYYY'))
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
    console.log('random.txt thingy');
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
            console.log('Something went wrong...')
            break
    }
}