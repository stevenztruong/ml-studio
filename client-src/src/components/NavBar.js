import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  TextField
} from '@material-ui/core';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount = () => {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('initialHref', window.location.href);
      window.location = '/login';
    }
  }


  render() {
    return (
      <AppBar style={{ position: "sticky", backgroundColor: 'white' }}>
        <Toolbar>
          <Grid container justify="flex-start">
            <Button style={{ marginLeft: "10px" }} onClick={() => { window.location = '/' }}>
              ML Studio
            </Button>
          </Grid>
          <Grid container justify="flex-end">
            <Button style={{ marginLeft: "10px" }} onClick={() => { window.location = '/addmodel' }}>
              Add Model
            </Button>
            <Button style={{ marginLeft: "10px" }} onClick={() => {
              sessionStorage.removeItem('token');
              window.location = '/login';
            }}>
              Logout
            </Button>
          </Grid>
        </Toolbar >
      </AppBar >
    );
  }
}

export default NavBar;
