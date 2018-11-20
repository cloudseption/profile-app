import React, { Component } from 'react';

class SearchResults extends Component {

    goToProfile = (profile) => {
        let userId = profile._id;
        window.location.href =`/profile/${userId}`
    }

    render() {
        return <div>
            {this.props.profiles.map(profile => <li key={profile.email}>
                <button onClick={() => { this.goToProfile(profile)} }>
                    {profile.name}
                </button>
              </li>)}
          </div>;
    }
}
 
export default SearchResults;