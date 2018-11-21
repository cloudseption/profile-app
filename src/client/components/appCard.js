import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 700,
      backgroundColor: theme.palette.background.paper,
      margin: 'auto',
      padding: '20px'
    },

    badge: {
       margin: '20px'
    },
});

class AppCard extends Component {
    
    render() { 
        const { classes } = this.props;

        return (      
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                            <Avatar src={this.props.imgUrl}/>
                            <ListItemText primary={this.props.appName}/>
                            {this.displayApplicationData()}
                            <Button variant="contained" color="primary" > 
                                To App 
                            </Button>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </div>
        );
    }

    displayApplicationData = () => {
       let appDataNumber = 3;
       let data = this.props.data;
       let newData;
       if (data.length > appDataNumber) {
           newData = data.slice(data.length - appDataNumber);
       }

       return (
        <List>
        <ListItem>
            <ListItemText primary={newData[0]}/>
            <ListItemText primary={newData[1]}/>
            <ListItemText primary={newData[2]}/>
        </ListItem>
        </List>
       )
    }

   
    
}
 
export default withStyles(styles)(AppCard);