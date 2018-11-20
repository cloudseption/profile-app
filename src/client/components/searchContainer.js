import React, { Component } from 'react';
import SearchBar from './searchBar';
import SearchResults from './searchResults';
import axios from "axios";

class SearchContainer extends Component {
    state = {  }
    render() { 
        return <React.Fragment>
            <SearchBar onGetProfile={this.handleGetProfile} />
            <SearchResults />
          </React.Fragment>;
    }

    // TODO: create links to the profiles
    handleGetProfile = searchParams => {
        console.log("Event handler called", searchParams);
        axios
            .get(
                `https://guarded-retreat-70427.herokuapp.com/api/search?input=${searchParams}`
            )
            .then(res => {
                try {
                    const profile = res.data;
                    console.log("profile", profile);
                } catch (e) {
                    console.log(e);
                }
            });
    }
}

export default SearchContainer;