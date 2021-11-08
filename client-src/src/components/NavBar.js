import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  TextField
} from '@material-ui/core';
import './NavBar.css';

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
      <AppBar className='page'>
        <Toolbar>
          <Grid container justify="flex-start">
            <Button className='button' onClick={() => { window.location = '/' }}>
              ML Studio
            </Button>
          </Grid>
          <Grid container justify="flex-end">
            <Button className='end-button' onClick={() => { window.location = '/addmodel' }}>
              Add Model
            </Button>
            <Button className='end-button' onClick={() => {
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
