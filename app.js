let axios = require("axios")
let inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
let fs = require("fs")

var moment = require('moment');
moment().format();



require('dotenv').config()





var spotify = new Spotify({
  id: "b57d5d89a4124b389c0651d768db5d0c",
  secret: "f012266b908b49a580d38097e1c3dd4b"
});



//main call that will begin page, all other calls are cascaded from this original call
let main = {
  type: "list",
  message: "choose an action",
  name: "mainList",
  choices: ["Movie Search", "Spotify Song Search", "Event Search", "Random Call"]
}
inquirer.prompt([
  main
]).then(function (response) {
  if (response.mainList === main.choices[0]) {
    movieFunc()
  }
  else if (response.mainList == main.choices[1]) {
    spotifyFunc()
  }
  else if (response.mainList == main.choices[2]) {
    eventFunc()
  }
  else {
    randoFunc()
  }
})


// function that will call if the movie chekcbox is selected
let movieFunc = () => {
  inquirer.prompt([
    {
      name: "question",
      message: "Enter a movie title",
      type: "input"
    }

  ]).then(function (response, err) {
    // movieFunc(response)
    if (err) {
      errMovie()
    }
    let omdAPI = `http://www.omdbapi.com/?t=${response.question}&y=&plot=short&apikey=${process.env.API_KEY}`
    axios.get(omdAPI).then(function (response) {
      console.log('The title of the movie: ' + response.data.Title)
      console.log('The Year this movie came out: ' + response.data.Year)
      console.log('The Movies Rating is: ' + response.data.imdbRating)
      console.log('The plot of the Movie: ' + response.data.Plot)
      console.log('This movie was produced in: ' + response.data.Country)
      console.log('The languages of this movie are: ' + response.data.Language)
      console.log('The Actors in this move are:' + response.data.Actors)
    })
  })

}

//function that will run if spotify is chose on the checkbox

let spotifyFunc = () => {
  let emptyA = []

  let getSong = {
    input: "text",
    message: "Enter the song you would like to get details on",
    name: "song"
  }

  inquirer.prompt([
    getSong
  ]).then(function (response) {
    spotify.search({ type: 'track', query: response.song }, function (err, data) {
      if (err) {
        errorFunc()
      }
      let base = data.tracks.items[0]


      for (var i = 0; i < base.artists.length; i++) {
        emptyA.push(base.artists[i].name);
      }
      if (emptyA.length > 1) {
        console.log("The Writers of this song are " + emptyA)
      }
      else {
        console.log("The writer of this song is " + data.tracks.items[0].artists[0])
      }
      console.log("The Name of the song is " + response.song);
      console.log("The link for this song is " + data.tracks.items[0].album.external_urls.spotify);
      console.log("The Album name of this song is " + base.album.name)
    });
  })




}



//function to search if event is chosen from checkbox

let eventFunc = () => {

  inquirer.prompt([
    {
      type: "input",
      message: "Please Enter an artist to see their next concerts details",
      name: "artist"
    }
  ]).then(function (response) {



    let eventURL = "https://rest.bandsintown.com/artists/" + response.artist + "/events?app_id=9c673c07-eb63-4998-b172-0fb87bbf3b01&date=upcoming"

    axios.get(eventURL).then(function (response) {
      let base = response.data[0];
      let time = base.datetime;
      time = moment(time).format("MM-DD-YYYY")
      console.log(`The Next Concert for the band is : ${time}`)
      console.log(`The name of the Venue is: ${base.venue.name}`)
      console.log(`The country of this Venue is: ${base.venue.country}`)
    })
  })

}

//random call based on file using fs package
let randoFunc = () => {

  fs.readFile("file.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err)
    }
    let omdAPI = `http://www.omdbapi.com/?t=${data}&y=&plot=short&apikey=${process.env.API_KEY}`
    axios.get(omdAPI).then(function (response) {
      console.log('The title of the movie: ' + response.data.Title)
      console.log('The Year this movie came out: ' + response.data.Year)
      console.log('The Movies Rating is: ' + response.data.imdbRating)
      console.log('The plot of the Movie: ' + response.data.Plot)
      console.log('This movie was produced in: ' + response.data.Country)
      console.log('The languages of this movie are: ' + response.data.Language)
      console.log('The Actors in this move are:' + response.data.Actors)
    })
  })

}

let errMovie = () => {
  let omdAPI = `http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=${process.env.API_KEY}`
  axios.get(omdAPI).then(function (response) {
    console.log('The title of the movie: ' + response.data.Title)
    console.log('The Year this movie came out: ' + response.data.Year)
    console.log('The Movies Rating is: ' + response.data.imdbRating)
    console.log('The plot of the Movie: ' + response.data.Plot)
    console.log('This movie was produced in: ' + response.data.Country)
    console.log('The languages of this movie are: ' + response.data.Language)
    console.log('The Actors in this move are:' + response.data.Actors)
  })
}

//function to search space jam if error is called
let errorFunc = () => {

  spotify.search({ type: 'track', query: "space Jam" }, function (err, data) {
    if (err) {
      console.log(err)
    }

    console.log(data.tracks.items[1])

    console.log("The Dj Name of Space jam is: " + data.tracks.items[1].artists[0].name);
    console.log("The name of the ssong is: " + data.tracks.items[1].name);
    console.log("The Url preview for this song is: " + data.tracks.items[1].preview_url);
    console.log("The name of the Album is: " + data.tracks.items[1].album.name)

  });
}



