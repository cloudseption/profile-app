import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
    
    state = {  
        appName: this.props.appName,
        imgurl: this.props.imgurl,
        data: this.props.data
    }

    render() { 
        const { classes } = this.props;

        return (      
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                            <Avatar src={this.getImgUrl()}/>
                            <ListItemText primary={this.getAppName()}/>
                            <Button variant="contained" color="primary" > 
                                To App 
                            </Button>
                            
                            </ListItem>
                        </List>
                        <Typography>
                           {this.getData()}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }

    getAppName = () => {
        return this.state.appName;
    }

    getImgUrl = () => {
        return this.state.imgurl;
    }

    getData = () => {
        return this.state.data;
    }
}
 
export default withStyles(styles)(AppCard);