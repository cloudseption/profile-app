import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';
import axios from 'axios';

class Home extends Component {
    
    state = {  
        landingPageData : []
    }

    componentDidMount = () => {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': '$&tiduh3%gfg',
            'Userid': 'c810f3c1-dd7d-4085-b85a-4839713d6c1b'
    
        }
        axios.get("http://localhost:3000/api/users/c810f3c1-dd7d-4085-b85a-4839713d6c1b/landing-data")
        .then(response => {
            console.log(response.data);
            
            this.setState({
                landingPageData: [
                    {
                        appName: "Tiny Tank Game",
                        imgUrl: "https://png.icons8.com/app",
                        appUrl: "",
                        text: 'This apps top score'
                    },
                    {
                        appName: "Quiz App",
                        imgUrl: "https://png.icons8.com/app",
                        appUrl: "",
                        text: 'This apps top score'
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