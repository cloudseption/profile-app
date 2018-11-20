import React, { Component } from 'react';

class SearchResults extends Component {
    state = {
        profiles:[
            { id: 1, value: 'yas' },
            { id: 2, value: 'queen' }
        ]
    }
    render() {
        return <div>
            {this.state.profiles.map(profile => 
              <li>{profile.value}</li>
            )}
          </div>;
    }
}
 
export default SearchResults;