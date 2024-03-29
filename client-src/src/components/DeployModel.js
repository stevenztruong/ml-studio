import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Backdrop,
  CircularProgress,
  Card,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';

import NavBar from './NavBar';
import axios from 'axios';
import './DeployModel.css';

export default class DeployModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: 'svm',
      modelName: "",
      showLoading: true,
      apiResult: {},
      showPredictionResult: false,
      predictionResult: ''
    };
  }

  componentDidMount = async () => {
    this.setState({ showLoading: true });
    let splitPath = window.location.pathname.split('/');
    let modelId = splitPath[splitPath.length - 1];
    if (modelId) {
      this.setState({ modelId: modelId });
      await axios.get(
        process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + modelId + '/deployments',
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
          }
        }
      ).then(async res => {
        this.setState({ showLoading: false, apiResult: res?.data })
      }).catch(error => {
        this.setState({ showLoading: false });
        alert(error);
      })
    }
    else {
      alert("Failed to retrieve deployment information");
      window.location = '/';
    }
  }

  handleSelectedModelChange = (e) => {
    this.setState({ selectedModel: e.target.value });
  }

  uploadTrainingAndClassificationData = async () => {
    this.setState({ showLoading: true });
    let form_data = new FormData();
    form_data.append('trainingData', this.state.trainingData)
    form_data.append('classificationData', this.state.trainingClassificationData)

    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/data',
      form_data,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(async res => {
      await this.trainAgainstModelApiCall(
        res.data.trainingData,
        res.data.classificationData
      );
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  trainAgainstModelApiCall = async (trainingDataPath, classificationDataPath) => {
    this.setState({ showLoading: true });
    await axios.post(
      // TODO: Call the API to test against the model and pass correct parameters
      process.env.REACT_APP_BACKEND_API_URL + '/v1/training',
      {
        userId: 1,
        modelType: this?.state?.apiResult?.modelType,
        modelName: this?.state?.apiResult?.modelName,
        parameters: this?.state?.apiResult?.parms ? this?.state?.apiResult?.parms : {},
        trainingData: trainingDataPath,
        classificationData: classificationDataPath,
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(res => {
      this.setState({ showLoading: false });
      alert("Training model in progress!")
      // window.location = '/';
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  uploadTestingAndClassificationData = async () => {
    this.setState({ showLoading: true });
    let form_data = new FormData();
    form_data.append('trainingData', this.state.testingData)
    form_data.append('classificationData', this.state.testingClassificationData)

    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/data',
      form_data,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(async res => {
      await this.testAgainstModelApiCall(
        res.data.trainingData,
        res.data.classificationData
      );
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  testAgainstModelApiCall = async (testingDataPath, classificationDataPath) => {
    this.setState({ showLoading: true });
    await axios.post(
      // TODO: Call the API to test against the model and pass correct parameters
      process.env.REACT_APP_BACKEND_API_URL + '/v1/testing',
      {
        userId: 1,
        modelType: this?.state?.apiResult?.modelType,
        modelName: this?.state?.apiResult?.modelName,
        parameters: this?.state?.apiResult?.parms ? this?.state?.apiResult?.parms : {},
        trainingData: testingDataPath,
        classificationData: classificationDataPath,
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(res => {
      this.setState({ showLoading: false });
      alert("Testing model in progress!")
      // window.location = '/';
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }


  uploadPredictionData = async () => {
    this.setState({ showLoading: true });
    let form_data = new FormData();
    form_data.append('predictionData', this.state.predictionData);

    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/data',
      form_data,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(async res => {
      await this.predictAgainstModelApiCall(
        res.data.predictionData,
      );
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  predictAgainstModelApiCall = async (predictionDataPath) => {
    this.setState({ showLoading: true });
    await axios.post(
      // TODO: Call the API to predict against the model and pass correct parameters
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + this.state.apiResult[0].modelId +  '/deployments/' + this.state.apiResult[0].id +  '/predicting',
      {
        userId: 1,
        modelType: this.state.apiResult.modelType,
        params: this?.state?.apiResult?.parms ? this?.state?.apiResult?.parms : {},
        predictionData: predictionDataPath,
        modelName: this.state.apiResult.modelName,
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(res => {
      let processedResString = JSON.parse(res.data.split("Return object: ")[1]);
      this.setState({ showLoading: false, showPredictionResult: true, predictionResult: processedResString.prediction });
      // window.location = '/';
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  deleteModelApiCall = async (id) => {
    await axios.delete(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + id,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({ showLoading: false });
      alert("Successfully deleted model id: " + id);
      window.location = '/';
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  updateTrainingData = e => {
    this.setState({
      trainingData: e.target.files[0],
    })
  }

  updateTrainingClassificationData = e => {
    this.setState({
      trainingClassificationData: e.target.files[0],
    })
  }

  updateTestingData = e => {
    this.setState({
      testingData: e.target.files[0],
    })
  }

  updateTestingClassificationData = e => {
    this.setState({
      testingClassificationData: e.target.files[0],
    })
  }

  updatePredictionData = e => {
    this.setState({
      predictionData: e.target.files[0],
    })
  }

  renderModelName = () => {
    return (
      <div style={{ padding: "10px" }}>
        <TextField
          id="modelName"
          onChange={(e) => { this.setState({ modelName: e.target.value }) }}
          label="Model Name"
          variant="outlined"
          value={this.state.modelName}
        />
      </div>
    )
  }

  renderModelParameters = () => {
    if (this.state.selectedModel === 'svm') {
      return this.renderSvmParameters();
    }
    else if (this.state.selectedModel === 'knn') {
      return this.renderKnnParameters();
    }
  }

  renderSvmParameters = () => {
    return (
      <div style={{ padding: "2%" }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Model Parameters</FormLabel>
          <RadioGroup aria-label="parameters" name="parameters" value={this.state.selectedModel} onChange={this.handleSelectedModelChange}>
            <TextField disabled label="Layers" variant="outlined" style={{ padding: "2%" }} value={this.state.knnLayers} onChange={(e) => this.setState({ knnLayers: e.target.value })} />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  renderKnnParameters = () => {
    return (
      <div style={{ padding: "2%" }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Model Parameters</FormLabel>
          <RadioGroup aria-label="parameters" name="parameters" value={this.state.selectedModel} onChange={this.handleSelectedModelChange}>
            <TextField disabled label="Layers" variant="outlined" style={{ padding: "2%" }} value={this.state.knnLayers} onChange={(e) => this.setState({ knnLayers: e.target.value })} />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  handleDetails = () => {
    window.location = '/model/' + this.state.modelId;
  }

  render() {
    return (
      <div>
        <NavBar />
        <div >
          <h1 style={{ paddingTop: '50px',  paddingLeft: '50px' }}>Deploy Model</h1>
        </div>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className='deploy-model-container'>
            <Card className='deploy-model-card'>
              <h3>Deployment Name:</h3>
              <p>{this?.state?.apiResult && this?.state?.apiResult.length > 0 ? this?.state?.apiResult[0].deployName : ''} </p>
              <h3>Deployment Description:</h3>
              <p>{this?.state?.apiResult && this?.state?.apiResult.length > 0 ? this?.state?.apiResult[0].description : ''} </p>

              {/* <p>ID: {this?.state?.apiResult?.id}</p>
              {
                this?.state?.apiResult?.parms ?
                  <p>Parameters: {JSON.stringify(this?.state?.apiResult?.parms)}</p>
                  :
                  <p>Parameters: N/A</p>
              }
              <p>Model Type: {this?.state?.apiResult?.modelType}</p> */}
              {/* <p>Status: {this?.state?.apiResult?.status}</p> */}
            </Card>
          </div>
          <div className='deploy-model-container'>
            {/* <Card style={{ padding: "2%", marginBottom: "5%" }}>
              <h3>Train model:</h3>
              <FormLabel component="legend">Upload training and classification data:</FormLabel>
              <div style={{ 'display': 'inline-flex' }}>
                <div>
                  <div style={{ padding: "10px" }}>
                    Training data (.json): &nbsp;
                    <input type="file"
                      id="uploadtrainingData"
                      accept="application/JSON" onChange={this.updateTrainingData} required />
                  </div>
                  <div style={{ padding: "10px" }}>
                    Training classification data (.json): &nbsp;
                    <input type="file"
                      id="uploadClassificationData"
                      accept="application/JSON" onChange={this.updateTrainingClassificationData} required />
                  </div>
                </div>
                <Button
                  onClick={this.uploadTrainingAndClassificationData}
                  disabled={!(this.state.trainingData && this.state.trainingClassificationData)}
                >
                  Train
                </Button>
              </div>
            </Card>
            <Card style={{ padding: "2%", marginBottom: "5%" }}>
              <h3>Test model:</h3>
              <FormLabel component="legend">Upload testing and classification data:</FormLabel>
              <div style={{ 'display': 'inline-flex' }}>
                <div>
                  <div style={{ padding: "10px" }}>
                    Testing data (.json): &nbsp;
                    <input type="file"
                      id="uploadtrainingData"
                      accept="application/JSON" onChange={this.updateTestingData} required />
                  </div>
                  <div style={{ padding: "10px" }}>
                    Testing classification data (.json): &nbsp;
                    <input type="file"
                      id="uploadClassificationData"
                      accept="application/JSON" onChange={this.updateTestingClassificationData} required />
                  </div>
                </div>
                <Button
                  onClick={this.uploadTestingAndClassificationData}
                  disabled={!(this.state.testingData && this.state.testingClassificationData)}
                >
                  Test
                </Button>
              </div>
            </Card> */}
            <Card className='deploy-model-card'>
              <h3>Predict against model:</h3>
              <FormLabel component="legend">Upload prediction data:</FormLabel>
              <div style={{ 'display': 'inline-flex' }}>
                <div style={{ 'display': 'block', paddingTop: "20px" }}>
                  Prediction data (.json): &nbsp;
                  <input 
                    style={{ paddingLeft: "10px" }}
                    type="file"
                    id="uploadpredictionData"
                    accept="application/JSON" onChange={this.updatePredictionData} required />
                  <Button 
                    style={{  
                      height:'5%', 
                      width: '30%', 
                      padding: '20px',
                      marginLeft: '1%', 
                      marginTop: '3%', 
                      backgroundColor: !(this.state.predictionData) ?  'rgb(162, 162, 162)' : 'rgb(63, 124, 247)',
                      color: 'white'
                    }}
                    disabled={!(this.state.predictionData)}
                    onClick={this.uploadPredictionData}
                  >
                  Predict
                </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        {/* <div style={{ padding: "2%" }}>
          <Button onClick={this.handleDetails}>Details</Button>
        </div> */}
        <Backdrop
          style={{ zIndex: 1 }}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={this.state.showPredictionResult}
          onClose={this.handleDeleteModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Prediction result:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.predictionResult}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.setState({ showPredictionResult: false }) }} autoFocus>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
