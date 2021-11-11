import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Card,
  Button,
  TextField,
  Grid
} from '@material-ui/core';
import Box from '@material-ui/core/Box';

import axios from 'axios';
import './CreateAccount.css';

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      email: '',
      username: '',
      password: '',
      showLoading: false,
    };
  }

  componentDidMount = async () => {
  }

  onCreateAccount = async () => {
    this.setState({ showLoading: true });
    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/users',
      {
        fullName: this.state.fullName,
        password: this.state.password,
        email: this.state.email,
        username: this.state.username,
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({ showLoading: false });
      window.location = '/';
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })

  }

  render() {
    return (
      <div className='page'>
        <div>

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
              <div className='create-account-container'>
                <h2 >CREATE ACCOUNT</h2>
                  <TextField
                    margin="normal"
                    className='form'
                    id="fullname"
                    onChange={(e) => { this.setState({ fullName: e.target.value }) }}
                    label="Full name"
                    variant="outlined"
                    value={this.state.fullName}
                  />
                  <TextField
                    margin="normal"
                    className='form'
                    id="email"
                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                    label="Email"
                    variant="outlined"
                    value={this.state.email}
                    type="email"
                  />
                  <TextField
                    margin="normal"
                    className='form'
                    id="username"
                    onChange={(e) => { this.setState({ username: e.target.value }) }}
                    label="Username"
                    variant="outlined"
                    value={this.state.username}
                  />
                  <TextField
                    margin="normal"
                    className='form'
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
                  onClick={this.onCreateAccount}
                  variant="contained"
                  color="primary"
                  className='button'
                >
                  Create Account
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
