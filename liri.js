require("dotenv").config()
const keys = require("./keys.js")
const moment = require("moment")
const axios = require("axios")
const fs = require("fs")
const Spotify = require("node-spotify-api")
const inquirer = require("inquirer")
const spotifyApi = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
})

inquirer.prompt([
    {   type: "list",
        message: "What module do you want to use?",
        choices: ["Concerts", "Spotify", "Movies", "random.txt"],
        name: "module"
    },
    ]).then(inqResponse => {
        if (inqResponse.module === 'random.txt' ) {
            doRandom()
        }
        else {
            inquirer.prompt([
                {   type: "input",
                message: "What do you want to search for? ",
                name: "searchTerm"
                }
            ]).then(searchResponse => {
                inquirer.prompt([
                    {   type: "confirm",
                        message: `So you want to search ${inqResponse.module} for "${searchResponse.searchTerm}"?`,
                        name: "confirm",
                        default: true }
                    ]).then(finalResponse => {     
                        if (finalResponse.confirm) {
                            switch (inqResponse.module) {
                                case 'Concerts': 
                                    getMeConcert(searchResponse.searchTerm)
                                    break
                                case 'Spotify':
                                    getMeSpotify(searchResponse.searchTerm)
                                    break
                                case 'Movies':
                                    getMeMovie(searchResponse.searchTerm)
                                    break
                                default :
                                    console.log('Ooops. Something went wrong.')
                                    break
                            }
                        }
                    })
                })
            }
        })


const getMeSpotify = songName => {
    if (!songName) songName = "The Sign"
    let spotifySearch = {}
    spotifySearch.type = 'track'
    spotifySearch.query = songName
    spotifyApi.search(spotifySearch, (err, data) => {
        if (err) return console.log('Error occurred: ' + err)
        if (data.tracks.items.length === 0) {
            console.log('No tracks were found for that search term.')
        }
        else {
            data.tracks.items.forEach(element => {
                console.log(`Artist: ${element.artists[0].name}`)
                console.log(`Song Name ${element.name}`)
                console.log(`Album Name ${element.album.name}`)
                console.log(`Preview URL: ${element.external_urls.spotify}`)
                console.log('===============================================')
            })
        }
    })
}

const getMeConcert = artistName => {
    if (!artistName) artistName = "Rolling Stones"
    let theURL = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp&date=upcoming`
    axios.get(theURL)
        .then(results => {
            results.data.forEach(element => {
                console.log(`Venue Name: ${element.venue.name}`)
                console.log(`Venue Location: ${element.venue.city}, ${element.venue.region}`)
                console.log(`Concert Date: ${moment(element.datetime).format('MM/DD/YYYY')}`)
                console.log('===============================================')
            })
        }).catch(err => {
            console.log('catch function')
            console.log(err.response.data.errorMessage)
        })
}

const getMeMovie = movieName => {
    if (!movieName) movieName = 'Mr Nobody'
    axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movieName}`)
        .then(results => {
            if (results.data.Response !== "False") {
                console.log(`Title: ${results.data.Title}`)
                console.log(`Year: ${results.data.Year}`)
                console.log(`IMDB Rating: ${results.data.Ratings[0].Value}`)  // IMDB
                console.log(`Rotten Tomatoes Rating: ${results.data.Ratings[2].Value}`)  // Rotten Tomatoes
                console.log(`Country: ${results.data.Country}`)
                console.log(`Language: ${results.data.Language}`)
                console.log(`Plot: ${results.data.Plot}`)
                console.log(`Actors ${results.data.Actors}`)
            }
            else {
                console.log(results.data.Error)
            }
        })
}

const doRandom = () => {
    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) return console.log(error.code);
        let stuff = data.split(",")
        switch (stuff[0].toLowerCase()) {
            case 'concerts': 
                getMeConcert(stuff[1])
                break
            case 'spotify':
                getMeSpotify(stuff[1])
                break
            case 'movies':
                getMeMovie(stuff[1])
                break
            default:
                console.log("Ooops. Something went wrong.") }
      })
}