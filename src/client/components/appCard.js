import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    appCards: {
      width: '100%',
      maxWidth: 800,
      backgroundColor: theme.palette.background.paper,
      margin: 'auto',
      padding: '20px',
    },

    badge: {
       margin: '20px'
    },
    
});

class AppCard extends Component {
    
    render() { 
        const { classes } = this.props;

        return (      
            <div className={classes.appCards}>
                <List>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                            <Avatar src={this.props.imgUrl}/>
                            <ListItemText primary={this.props.appName}/>
                            <ListItemText primary={this.props.text}/>
                            <Button onClick={this.openApp} variant="contained" color="primary" > 
                                To App 
                            </Button>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
                </List>
            </div>
        );
    }

    openApp = () => {
       window.location = this.props.appUrl;
    }
}
 
export default withStyles(styles)(AppCard);