import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Card,
  Button,
  TextField
} from '@material-ui/core';

import NavBar from './NavBar';
import axios from 'axios';

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
      }
    ).then(res => {
      this.setState({showLoading: false});
      window.location = '/';
    }).catch(error => {
      this.setState({showLoading: false});
      alert(error);
    })

  }

  render() {
    return (
      <div>
        <div>
          <NavBar />
          <Card style={{ width: '30%', padding: "2%" }}>
            <div style={{ padding: "10px" }}>
              <TextField
                style={{ width: '80%' }}
                id="fullname"
                onChange={(e) => { this.setState({ fullName: e.target.value }) }}
                label="Full name"
                variant="outlined"
                value={this.state.fullName}
              />
            </div>
            <div style={{ padding: "10px" }}>
              <TextField
                style={{ width: '80%' }}
                id="email"
                onChange={(e) => { this.setState({ email: e.target.value }) }}
                label="Email"
                variant="outlined"
                value={this.state.email}
                type="email"
              />
            </div>
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
            <Button onClick={this.onCreateAccount}>Create Account</Button>
          </Card>
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