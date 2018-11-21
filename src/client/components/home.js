import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';
<<<<<<< HEAD
=======
import Button from '@material-ui/core/Button';
>>>>>>> 489f97fbe661324b4498f29f7ec3a7bfac0d46e0

class Home extends Component {
    
    state = {  
        landingPageData : [
            {
                appName: "app1",
<<<<<<< HEAD
                imgUrl: "https://png.icons8.com/app",
                appUrl: "",
                data: ["app data", "app data2", "app data3", "appData4"]
            },

            {
                appName: "app2",
                imgUrl: "https://png.icons8.com/app",
                appUrl: "",
                data: ["app data", "app data2", "app data3", "appData4"]
=======
                imgurl: "https://png.icons8.com/app",
                data: ["app data"]
            },

            {
                appName: "app1",
                imgurl: "https://png.icons8.com/app",
                data: ["app data"]
>>>>>>> 489f97fbe661324b4498f29f7ec3a7bfac0d46e0
            }
        ]
    }

    render() { 
        return (      
            <div>
<<<<<<< HEAD
            <List>
            {this.state.landingPageData.map(appData => (
                <AppCard key={appData.appName}
                    appName={appData.appName} imgUrl={appData.imgUrl} 
                    appUrl={appData.appUrl} data={appData.data}/>                
=======
            <Button variant="contained" color="primary">Profile</Button>
            <List>
            {this.state.landingPageData.map(appData => (
                <AppCard appName={appData.appName} imgurl={appData.imgurl} data={appData.data}/>                
>>>>>>> 489f97fbe661324b4498f29f7ec3a7bfac0d46e0
            ))}
            </List>
            </div>
        );
    }
}
 
export default Home;