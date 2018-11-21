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


    render() { 
        const { classes } = this.props;

        return (      
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                            <Avatar src={this.props.imgurl}/>
                            <ListItemText primary={this.props.appName}/>
                            <Button variant="contained" color="primary" > 
                                To App 
                            </Button>
                            </ListItem>
                        </List>
                        <Typography>
                           {this.props.data}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }

}
 
export default withStyles(styles)(AppCard);