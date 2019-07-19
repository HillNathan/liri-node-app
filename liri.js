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
    console.log(`concert thingy ${artistName}`)
}

const getMeMovie = movieName => {
    console.log(`movie thingy ${movieName}`)
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