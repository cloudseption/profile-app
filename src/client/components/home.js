import React, { Component } from 'react';
import List from '@material-ui/core/List';
import AppCard from './appCard.js';

class Home extends Component {
    
    state = {  
        landingPageData : [
            {
                appName: "app1",
                imgUrl: "https://png.icons8.com/app",
                appUrl: "https://www.google.ca",
                data: ["app data", "app data2", "app data3", "appData4"]
            },

            {
                appName: "app2",
                imgUrl: "https://png.icons8.com/app",
                appUrl: "",
                data: ["app data", "app data2", "app data3", "appData4"]
            }
        ]
    }

    render() { 
        return (      
            <div>
            <List>
            {this.state.landingPageData.map(appData => (
                <AppCard key={appData.appName}
                    appName={appData.appName} imgUrl={appData.imgUrl} 
                    appUrl={appData.appUrl} data={appData.data}/>                
            ))}
            </List>
            </div>
        );
    }
}
 
export default Home;