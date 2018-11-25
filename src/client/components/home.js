import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';
import axios from 'axios';

class Home extends Component {
    
    state = {  
        landingPageData : []
    }

    componentDidMount = () => {
        axios.get(`${window.location.origin}/api/users/${window.localStorage.userId}/landing-data`)
        .then(response => {
            
            this.setState({
                landingPageData: response.data
            });
        });
    }

    render() { 
        console.log("LANDING DATA", this.state.landingPageData);
        if (this.state.landingPageData[0] != undefined){
            console.log("DATA[0]", (this.state.landingPageData[0].data[0]));
        }
        if (window.localStorage.userId == "" || window.localStorage.userId == undefined) {
            window.location = "/auth/login.html";
        }
        return <div>
            <List>
              {this.state.landingPageData.map(appData => (
                <AppCard
                  key={appData.name}
                  appName={appData.name}
                  imgUrl={appData['img-url']}
                  appUrl={appData.link}
                  text={appData.data[0] ? appData.data[0] : "Not Added"}
                />
              ))}
            </List>
          </div>;
    }
}
 
export default Home;