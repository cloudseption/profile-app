import React, { Component } from 'react';
import SearchBar from './searchBar';
import SearchResults from './searchResults';
import axios from "axios";

class SearchContainer extends Component {
    state = { profiles: [] }

    render() { 
        return (
            <React.Fragment>
                <SearchBar onGetProfile={this.handleGetProfile} />
                <SearchResults profiles={this.state.profiles} />
            </React.Fragment>
        );
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