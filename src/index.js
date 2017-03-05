// React
var React = require('react')
var ReactDOM = require('react-dom')

// Google Maps
var ReactGMaps = require('react-gmaps')
var {Gmaps, Marker} = ReactGMaps

// Movie data
var movieData = require('./data/movies.json')
var theatres = require('./data/theatres.json')

// Components
var Header = require('./components/Header')
var MovieDetails = require('./components/MovieDetails')
var MovieList = require('./components/MovieList')
var NoCurrentMovie = require('./components/NoCurrentMovie')
var SortBar = require('./components/SortBar')
var MovieMap = require('./components/MovieMap')


// Firebase configuration
var Rebase = require('re-base')
var base = Rebase.createClass({
  apiKey: "AIzaSyDhRjOQWGZlli2WtpfLyNV4dkQNGUQ03g8",   // replace with your Firebase application's API key
  databaseURL: "https://buyflix-final-72a7d.firebaseio.com/", // replace with your Firebase application's database URL
})

var App = React.createClass({
  movieClicked: function(movie) {
    this.setState({
      currentMovie: movie
    })
  },
  movieWatched: function(movie) {
    var existingMovies = this.state.movies
    var moviesWithWatchedMovieRemoved = existingMovies.filter(function(existingMovie) {
      return existingMovie.id !== movie.id
    })
    this.setState({
      movies: moviesWithWatchedMovieRemoved,
      currentMovie: null
    })
  },
  resetMovieListClicked: function() {
    this.setState({
      movies: movieData.sort(this.movieCompareByReleased)
    })
  },

  // View is either "latest" (movies sorted by release), "alpha" (movies
  // sorted A-Z), or "map" (the data visualized)
  // We should probably do the sorting and setting of movies in state here.
  // You should really look at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

  viewChanged: function(view) {

    this.setState({
      currentView: view
    })

    if (view === "alpha") {
    this.setState({
      movies: movieData.sort(this.movieCompareByTitle),
      latest: "",
      alpha: "active",
      map: ""
      })


    } else if (view === "latest") {
    this.setState({
      movies: movieData.sort(this.movieCompareByReleased),
      latest: "active",
      alpha: "",
      map: ""
      })

    }  else if (view === "map") {
    this.setState({
      latest: "",
      alpha: "",
      map: "active"
      })
    }
  },

  renderMovieDetails: function() {
    if (this.state.currentMovie == null) {
      return <NoCurrentMovie resetMovieListClicked={this.resetMovieListClicked} />
    } else {
      return <MovieDetails movie={this.state.currentMovie}
                           movieWatched={this.movieWatched} />
    }
  },
  renderMainSection: function() {
    if (this.state.currentView === 'map') {
      return < MovieMap />
      }

    else {
      return (
        <div>
          <MovieList movies={this.state.movies} movieClicked={this.movieClicked} />
          {this.renderMovieDetails()}
        </div>
      )
    }
  },

  movieCompareByTitle: function(movieA, movieB) {
    if (movieA.title < movieB.title) {
      return -1
    } else if (movieA.title > movieB.title) {
      return 1
    } else {
      return 0
    }
  },
  movieCompareByReleased: function(movieA, movieB) {
    if (movieA.released > movieB.released) {
      return -1
    } else if (movieA.released < movieB.released) {
      return 1
    } else {
      return 0
    }
  },
  getInitialState: function() {
    return {
      movies: movieData.sort(this.movieCompareByReleased),
      currentMovie: null,
      currentView: 'latest'
    }
  },
  componentDidMount: function() {
    // We'll need to enter our Firebase configuration at the top of this file and
    // un-comment this to make the Firebase database work
    base.syncState('/movies', { context: this, state: 'movies', asArray: true })
  },
  render: function() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <SortBar movieCount={this.state.movies.length} viewChanged={this.viewChanged} />
        <div className="main row">
          {this.renderMainSection()}
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App />, document.getElementById("app"))
