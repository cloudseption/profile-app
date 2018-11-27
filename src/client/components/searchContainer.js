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

      console.log(searchParams);
      const skill = searchParams.skill;
      const score = searchParams.score;

      // Get profiles of all users in external apps matching search.
      const advSearchUrl = `${document.location.protocol}//${document.location.host}/api/users/${skill}/${score}/score-data`;
      axios.get(advSearchUrl).then(res => {
        try{
          if (res && res.data) {
            this.setState({ profiles: res.data });
          }
        } catch(e) {
          console.log(e);
        }
      });
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