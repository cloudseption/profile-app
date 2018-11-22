import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';
import axios from 'axios';

class Home extends Component {
    
    state = {  
        landingPageData : []
    }

    componentDidMount = () => {
        axios.get(`http://localhost:3000/api/users/${window.localStorage.userId}/landing-data`)
        .then(response => {
            console.log(response.data);
            
            this.setState({
                landingPageData: [
                    {
                        appName: response.data[2].name,
                        imgUrl: "https://png.icons8.com/app",
                        appUrl: "",
                        text: response.data[2].data[0]
                    },
                    {
                        appName: response.data[1].name,
                        imgUrl: response.data[1]['img-url'],
                        text: response.data[1].data[0]
                    },
                    {
                        appName: response.data[0].name,
                        imgUrl: response.data[0]['icon-url'],
                        appUrl: response.data[0].link,
                        text: response.data[0].text
                    }
                ]  
            });
        });
    }

    render() { 
        return (      
            <div>
            <List>
            {this.state.landingPageData.map(appData => (
                <AppCard key={appData.appName}
                    appName={appData.appName} imgUrl={appData.imgUrl} 
                    appUrl={appData.appUrl} text={appData.text}/>                
            ))}
            </List>
            </div>
        );
    }
}
 
export default Home;