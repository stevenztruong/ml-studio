import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Card,
  Button,
  TextField,
  Grid
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Box from '@material-ui/core/Box';
import './Login.css';

import NavBar from './NavBar';
import axios from 'axios';

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showLoading: false,
    };
  }

  componentDidMount = async () => {
  }

  onLogin = async () => {
    this.setState({ showLoading: true });
    await axios.get(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/login',
      {
        headers: {
          'username': this.state.username,
          'password': this.state.password,
        }
      }
    ).then(res => {
      if (res.data.status == "Authenticated") {
        sessionStorage.setItem('token', res.data.accessToken);
        this.setState({ showLoading: false });
        if(sessionStorage.getItem('initialHref')) {
          window.location = sessionStorage.getItem('initialHref');
          sessionStorage.removeItem('initialHref');
        }
        else {
          sessionStorage.removeItem('initialHref');
          window.location = '/';

        }
      }
      else {
        alert("Invalid credentials");
      }
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })

  }

  render() {
    return (
      <div className='page'>
        <div >
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}

          >
            <h1 style ={{color: "white"}}>Online Machine Learning Studio</h1>
            <Card className='card'>
              <div className='login-container'>
                <Avatar className='avatar' >
                  <LockOutlinedIcon />
                </Avatar>
                <h2>Login</h2>
                {/* <div className='form' > */}
                  <TextField
                    // style={{ width: '80%' }}
                    margin="normal"
                    className='form'
                    id="username"
                    onChange={(e) => { this.setState({ username: e.target.value }) }}
                    label="Username"
                    variant="outlined"
                    value={this.state.username}
                  />
                {/* </div> */}
                  <TextField
                    className='form'
                    margin="normal"
                    id="password"
                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                    label="Password"
                    variant="outlined"
                    value={this.state.password}
                    type="password"
                  />
                  <Box sx={{ m: "0.5rem" }}></Box>
                  <Button
                    margin="normal"
                    onClick={this.onLogin}
                    variant="contained"
                    color="primary"
                    className='button'
                    disabled={this.state.username === '' || this.state.password === ''}
                  >
                    SIGN IN
                  </Button>
                  <Box sx={{ m: "0.5rem" }}></Box>
                  <Button
                    margin="normal"
                    onClick={() => { window.location = '/createaccount' }}
                    variant="contained"
                    color="primary"
                    className='button'
                    sx={{mt: 2}}
                  >
                    Create an Account
                  </Button>
              </div>
            </Card>
          </Grid>
        </div>
        <Backdrop
          style={{ zIndex: 1 }}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}
