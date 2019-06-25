let axios = require("axios")
let inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: "b57d5d89a4124b389c0651d768db5d0c",
  secret: "f012266b908b49a580d38097e1c3dd4b"
});



//main call that will begin page, all other calls are cascaded from this original call
let main = {
  type: "list",
  message: "choose an action",
  name: "mainList",
  choices: ["Movie Search", "Spotify Song Search"]
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
})


// function that will call if the movie chekcbox is selected
let movieFunc = () => {
  inquirer.prompt([
    {
      name: "question",
      message: "Enter a movie title",
      type: "input"
    }

  ]).then(function (response) {
    movieFunc(response)
    let omdAPI = "http://www.omdbapi.com/?t=" + response.question + "&y=&plot=short&apikey=91413d43"
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



