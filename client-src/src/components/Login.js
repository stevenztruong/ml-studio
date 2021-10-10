import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Card,
  Button,
  TextField,
  Grid
} from '@material-ui/core';

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
      if(res.data.status == "Authenticated"){
        sessionStorage.setItem('token', res.data.accessToken);
        this.setState({showLoading: false});
        window.location = '/';
      }
      else {
        alert("Invalid credentials");
      }
    }).catch(error => {
      this.setState({showLoading: false});
      alert(error);
    })

  }

  render() {
    return (
      <div>
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}

          >
              <h1>Online Machine Learning Studio</h1>
              <Card style={{ width: '25%', padding: "2%" }}>
                    <h2 style={{ padding: "10px" }}>Login</h2>
                    <div style={{ padding: "10px" }}>
                    <TextField
                        style={{ width: '80%' }}
                        id="username"
                        onChange={(e) => { this.setState({ username: e.target.value }) }}
                        label="Username"
                        variant="outlined"
                        value={this.state.username}
                    />
                    </div>
                    <div style={{ padding: "10px" }}>
                    <TextField
                        style={{ width: '80%' }}
                        id="password"
                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                        label="Password"
                        variant="outlined"
                        value={this.state.password}
                        type="password"
                    />
                    </div>
                    <div>
                    <Button onClick={this.onLogin}>SIGN IN</Button>
                    </div>
                    <Button onClick={() => { window.location = '/createaccount' }}>Create an Account</Button>
                </Card>
          </Grid>
        </div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}
