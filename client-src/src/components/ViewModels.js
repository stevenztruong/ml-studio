import React from 'react'
import NavBar from './NavBar';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Button
} from '@material-ui/core/'
import axios from 'axios';

export default class ModelDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }



  componentDidMount = async () => {
    this.getModelApiCall()
  }

  getModelApiCall = async () => {
    await axios.get(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models',
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({ data: res.data })
    }).catch(error => {
      alert(error);
    })
  }

  deleteModelApiCall = async (id) => {
    await axios.delete(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + id
    ).then(res => {
      this.getModelApiCall()
    }).catch(error => {
      alert(error);
    })
  }

  viewModelDetails = async (id) => {
    window.location = '/model/' + id;
  }

  render() {
    return (
      <div >
        <NavBar />
        <h1>Models Dashboard </h1>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {this.state.data.map(elem => (
            <Grid item xs={12} sm={6} md={3} key={this.state.data.indexOf(elem)}>
              <Card>
                <CardHeader
                  title={`Id : ${elem.id}`}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    <p>User Id : {elem.userId}</p>
                    <p>Model Name : {elem.modelName}</p>
                    <p>Model Type : {elem.modelType}</p>
                    <p>Status : {elem.status}</p>
                    <p>Parms : {elem.parms}</p>
                    <Button style={{ marginLeft: "10px" }} onClick={() => { this.viewModelDetails(elem.id) }}>
                      Details
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => { this.deleteModelApiCall(elem.id) }}>
                      Delete
                    </Button>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }
}
