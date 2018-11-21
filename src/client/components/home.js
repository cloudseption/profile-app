import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';
import Button from '@material-ui/core/Button';

class Home extends Component {
    
    state = {  
        landingPageData : [
            {
                appName: "app1",
                imgurl: "https://png.icons8.com/app",
                appUrl: "",
                data: ["app data"]
            }
        ]
    }

    render() { 
        return (      
            <div>
            <Button variant="contained" color="primary">Profile</Button>
            <List>
            {this.state.landingPageData.map(appData => (
                <AppCard appName={appData.appName} imgurl={appData.imgurl} data={appData.data}/>                
            ))}
            </List>
            </div>
        );
    }
}
 
export default Home;