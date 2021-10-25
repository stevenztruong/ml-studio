import React from 'react'
import NavBar from './NavBar';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core/'
import axios from 'axios';

export default class ModelDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showLoading: true,
      showDeleteModal: false,
      selectedDeleteModelId: '',
    };
  }



  componentDidMount = async () => {
    this.getModelApiCall()
  }

  getModelApiCall = async () => {
    this.setState({ showLoading: true });
    await axios.get(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models',
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({ data: res.data, showLoading: false })
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  deleteModelApiCall = async () => {
    let id = this.state.selectedDeleteModelId;
    this.setState({ showLoading: true });
    await axios.delete(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + id,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({selectedDeleteModelId: '', showDeleteModal: false});
      this.getModelApiCall();
    }).catch(error => {
      alert(error);
    })
  }

  viewModelDetails = async (id) => {
    window.location = '/model/' + id;
  }

  deleteModel =  async (id) => {
    this.setState({selectedDeleteModelId: id, showDeleteModal: true});
  }

  deployModel = async (id) => {
    window.location = '/deploy/' + id;
  }

  handleDeleteModelClose = () => {
    this.setState({selectedDeleteModelId: '', showDeleteModal: false});
  }

  render() {
    return (
      <div >
        <NavBar />
        <h1 style={{ paddingLeft: '2%' }}>Models Dashboard </h1>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          style={{ padding: '2%' }}
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
                    <p>Parms : {JSON.stringify(elem.parms)}</p>
                    <Button style={{ marginLeft: "10px" }} onClick={() => { this.viewModelDetails(elem.id) }}>
                      Details
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => { this.deleteModel(elem.id) }}>
                      Delete
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => { this.deployModel(elem.id) }}>
                      Deploy
                    </Button>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Backdrop
          style={{ zIndex: 1 }}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={this.state.showDeleteModal}
          onClose={this.handleDeleteModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm model deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Would you like to delete the selected model? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteModelClose}>Cancel</Button>
            <Button onClick={this.deleteModelApiCall} style={{backgroundColor: 'red', color: 'white'}} autoFocus>Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
