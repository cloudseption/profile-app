import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
    }
});

class Home extends Component {
    state = {  }

    render() { 
        const { classes } = this.props;

        return (      
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <List>
                            <ListItem>
                            <Avatar src="https://png.icons8.com/app"/>
                            <ListItemText primary={"appName"}/>
                            <Avatar className={classes.badge} src="https://png.icons8.com/app"/>
                            <Avatar className={classes.badge} src="https://png.icons8.com/app"/>
                            <Avatar className={classes.badge} src="https://png.icons8.com/app"/>
                            </ListItem>
                        </List>
                        <Typography>
                           app data
                        </Typography>
                    </CardContent>
                </Card>
            </div>

        );
    }
}
 
export default withStyles(styles)(Home);