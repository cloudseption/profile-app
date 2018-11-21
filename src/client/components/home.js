import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';
import Button from '@material-ui/core/Button';
import axios from 'axios';

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

    componentDidMount() {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': '$&tiduh3%gfg',
            'Userid': 'c810f3c1-dd7d-4085-b85a-4839713d6c1b'
    
        }
        axios.post("https://obbzuk8g48.execute-api.us-west-2.amazonaws.com/prod/api/landing",
        {},
        {headers: headers}
        
        );
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