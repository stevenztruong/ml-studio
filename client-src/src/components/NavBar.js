import React from 'react';
import '../components/NavBar.css';
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
      <AppBar style ={{position: "sticky",backgroundColor: "rgb(2, 23, 38)"}}>
        <Toolbar>
          <Grid container justify="flex-start">
            <Button style ={{color: "white", marginLeft: "20px"}} onClick={() => { window.location = '/' }}>
              Online Machine Learning Studio
            </Button>
          </Grid>
          <Grid container justify="flex-end">
            <Button style ={{color: "white"}} onClick={() => { window.location = '/addmodel' }}>
              Add Model
            </Button>
            <Button style ={{color: "white", marginRight: "20px"}} onClick={() => {
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
