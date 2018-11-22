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
            console.log(response.data);

            let app1 = {
                appName: "Unresponsive",
                imgUrl: "https://png.icons8.com/app",
                appUrl: "",
                text: ""
            };

            let app2 = {
                appName: "Unresponsive",
                imgUrl: "https://png.icons8.com/app",
                appUrl: "",
                text: ""
            };

            let app3 = {
                appName: "Unresponsive",
                imgUrl: "https://png.icons8.com/app",
                appUrl: "",
                text: ""
            };

            if (response.data[0]) {
                app1 = {
                    appName: response.data[0].name,
                    imgUrl: response.data[0]['img-url'],
                    appUrl: response.data[0].link,
                    text: response.data[0].data[0]
                };
            }

            if (response.data[1]) {
                app2 = {
                    appName: response.data[1].name,
                    imgUrl: response.data[1]['img-url'],
                    appUrl: response.data[1].link,
                    text: response.data[1].data[0]
                };
            }

            if (response.data[2]) {
                app3 = {
                    appName: response.data[2].name,
                    imgUrl: response.data[2]['img-url'],
                    appUrl: response.data[2].link,
                    text: response.data[2].data[0]
                };
            }

            this.setState({
                landingPageData: [
                    app1,
                    app2,
                    app3
                ]  
            });
        });
    }

    render() { 
        if (window.localStorage.userId == "" || window.localStorage.userId == undefined) {
            window.location = "/auth/login.html";
        }
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