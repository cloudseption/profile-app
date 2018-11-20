import React, { Component } from 'react';
import './searchResults.css';

class SearchResults extends Component {

    goToProfile = (profile) => {
        let userId = profile._id;
        window.location.href =`/profile/${userId}`
    }

    render() {
        return <ul>
            {this.props.profiles.map(profile => <li key={profile.email}>
                <div className="card m-2">
                <button className="result-button" onClick={() => { this.goToProfile(profile)} }>
                    {profile.name}
                </button>
                </div>
              </li>)}
          </ul>;
    }
}
 
export default SearchResults;