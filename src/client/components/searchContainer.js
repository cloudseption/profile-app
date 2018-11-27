import React, { Component } from 'react';
import SearchBar from './searchBar';
import AdvancedSearchBar from './advancedSearchBar';
import SearchResults from './searchResults';
import axios from "axios";

class SearchContainer extends Component {
    state = { profiles: [] }

    render() { 
        return (
            <React.Fragment>
                <SearchBar onGetProfile={this.handleGetProfile} />
                <AdvancedSearchBar onGetProfile={this.handleAdvancedSearch} />
                <SearchResults profiles={this.state.profiles} />
            </React.Fragment>
        );
    }

    handleAdvancedSearch = searchParams => {
      // parse the params
      console.log(searchParams);
      
      // call endpoint to search for all those skills with those scores in the high score table of each app.
      // axios
      //   .get(
      //     ``
      //   )
      //   .then(res => {
      //     try {
      //       const profiles = res.data;
      //       console.log("profiles", profiles);
      //       this.setState({ profiles });
      //     } catch (e) {
      //       console.log(e);
      //     }
      //   });
    }

    handleGetProfile = searchParams => {
        axios
          .get(
            `https://crowdseption-search-api.herokuapp.com/api/search?input=${searchParams}`
          )
          .then(res => {
            try {
              const profiles = res.data;
              console.log("profiles", profiles);
              this.setState({ profiles });
            } catch (e) {
              console.log(e);
            }
          });
    }
}

export default SearchContainer;