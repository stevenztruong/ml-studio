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
import download from 'downloadjs';
import './ModelDetails.css';

export default class ModelDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: 'svm',
      modelName: "",
      showLoading: true,
      apiResult: {},
      showTestResult: false,
      testResult: '',
      showDeleteModal: false,
      showDeployModal: false,
      description: '',
      buttonColor: {height:'5%', width: '20%', padding: '10px',marginLeft: '1%', marginTop: '1%',  backgroundColor: 'rgb(63, 124, 247)', color: 'Black' }
    };
  }

  componentDidMount = async () => {
    this.fetchModelDetails();
  }

  fetchModelDetails = async () => {
    this.setState({ showLoading: true });
    let splitPath = window.location.pathname.split('/');
    let modelId = splitPath[splitPath.length - 1];
    if (modelId) {
      this.setState({ modelId: modelId });
      await axios.get(
        process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + modelId,
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
      this.setState({ modelId: modelId });
      await axios.get(
        process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + modelId + '/deployments',
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
          }
        }
      ).then(async res => {
        this.setState({ showLoading: false, deploymentApiResult: res?.data })
      }).catch(error => {
        this.setState({ showLoading: false });
        alert(error);
      })
    }
    else {
      alert("Failed to retrieve model");
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
      let processedResString = JSON.parse(res.data.split("Return object: ")[1]);
      this.setState({ showLoading: false, showTestResult: true, testResult: processedResString.score });
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
      process.env.REACT_APP_BACKEND_API_URL + '/v1/predicting',
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

  downloadModelApiCall = async (fileName) => {
    //const FileDownload = require('js-file-download');
    await axios.get(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/data/' + fileName + '.pickle',
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      download(res.data, fileName + '.pickle' , res.headers['content-type']);
      this.setState({ showLoading: false });
      alert("Successfully download model name: " + fileName);
    }).catch(error => {
      this.setState({ showLoading: false });
      alert(error);
    })
  }

  deployModelApiCall = async (id, description, deploymentName) => {
    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + id + '/deployments',
      {
        deploymentName: deploymentName,
        description: description,
        modelId: parseInt(id),
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({ showLoading: false });
      alert("Successfully deployed model id: " + id);
      // window.location = '/';
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

  handleDownload = async () => {
    this.setState({ showLoading: true });
    await this.downloadModelApiCall(this?.state?.apiResult?.modelName);
    this.setState({ showLoading: false });
  }

  showDeleteModalHandler = () => {
    this.setState({ showDeleteModal: true });
  }

  handleDeleteModelClose = () => {
    this.setState({ showDeleteModal: false });
  }

  handleDeployModalClose = () => {
    this.setState({ showDeployModal: false });
  }

  handleDelete = async () => {
    this.setState({ showLoading: true });
    await this.deleteModelApiCall(this.state.modelId);
    this.setState({ showLoading: false });
  }

  handleDeploy = async () => {
    this.setState({ showLoading: true });
    await this.deployModelApiCall(this.state.modelId, this.state.description, this.state.deploymentName);
    this.fetchModelDetails();
    this.setState({ showLoading: false, showDeployModal: false });
  }

  handleShowDeploy = () => {
    this.setState({ showDeployModal: true });
    // window.location = '/deploy/' + this.state.modelId;
  }

  render() {
    return (
      <div>
        <NavBar />
        <div >
          {/* <h3>{this?.state?.apiResult?.modelName} (ID: {this?.state?.apiResult?.id})</h3> */}
          <h1 style={{ paddingTop: '50px',  paddingLeft: '50px' }}>Model Details </h1>
        </div>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: '40%', paddingLeft: "1%" }}>
            <div className='model-details-container1'>
              <Card className='model-details-card'>
                <h3>Details: </h3>
                <p>Name: {this?.state?.apiResult?.modelName} </p>
                <p>ID: {this?.state?.apiResult?.id}</p>
                {
                  this?.state?.apiResult?.parms ?
                    // <p>Parameters: {JSON.stringify(this?.state?.apiResult?.parms)}</p>
                    <p>
                      Parameters:
                      {Object.keys(this?.state?.apiResult?.parms).map((keyName, i) => (
                        <li key={i}>
                          {keyName}: {this?.state?.apiResult?.parms[keyName]}
                        </li>
                      ))}
                    </p>
                    :
                    <p>Parameters: N/A</p>
                }
                <p>Model Type: {this?.state?.apiResult?.modelType}</p>
                {
                  this?.state?.deploymentApiResult && this?.state?.deploymentApiResult.length > 0?
                    <span style={{ display: 'inline-block' }}>
                      {'Deployment URL: '}
                      <a href={window.location.href.replace('/model/', '/deploy/')}>{window.location.href.replace('/model/', '/deploy/')}</a>
                    </span>
                    :
                    <div />
                }
                {/* <p>Deployment URL: {)}</p> */}
                {/* <p>Status: {this?.state?.apiResult?.status}</p> */}
              </Card>
            </div>
          </div>
          <div style={{ display: 'block', width: '40%' }}>
            <div className='model-details-container2'>
              <Card className='model-details-card'>
                <h3>Train model:</h3>
                <FormLabel component="legend">Upload training and classification data:</FormLabel>
                <div style={{ 'display': 'block' }}>
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
                    style={{  
                      height:'5%', 
                      width: '20%', 
                      padding: '10px',
                      marginLeft: '1%', 
                      marginTop: '1%', 
                      backgroundColor: !(this.state.trainingData && this.state.trainingClassificationData) ?  'rgb(162, 162, 162)' : 'rgb(63, 124, 247)',
                      color: 'white'
                    }}
                    onClick={this.uploadTrainingAndClassificationData}
                    disabled={!(this.state.trainingData && this.state.trainingClassificationData)}
                  >
                    Train
                  </Button>
                </div>
              </Card>
            </div>
            <div className='model-details-container2'>
              <Card className='model-details-card'>
                <h3>Test model:</h3>
                <FormLabel component="legend">Upload testing and classification data:</FormLabel>
                <div style={{ 'display': 'block' }}>
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
                    style={{  
                      height:'5%', 
                      width: '20%', 
                      padding: '10px',
                      marginLeft: '1%', 
                      marginTop: '1%', 
                      backgroundColor: !(this.state.testingData && this.state.testingClassificationData) ?  'rgb(162, 162, 162)' : 'rgb(63, 124, 247)',
                      color: 'white'
                    }}
                    onClick={this.uploadTestingAndClassificationData}
                    disabled={!(this.state.testingData && this.state.testingClassificationData)}
                  >
                    Test
                  </Button>
                </div>
              </Card>
            </div>
            <div className='model-details-container2'>
              <Card className='model-details-card'>
                <h3>Predict against model:</h3>
                <FormLabel component="legend">Upload prediction data:</FormLabel>
                <div style={{ 'display': 'block' }}>
                  <div style={{ padding: "10px" }}>
                    Prediction data (.json): &nbsp;
                    <input type="file"
                      id="uploadpredictionData"
                      accept="application/JSON" onChange={this.updatePredictionData} required />
                  </div>
                  <Button
                    style={{  
                      height:'5%', 
                      width: '20%', 
                      padding: '10px',
                      marginLeft: '1%', 
                      marginTop: '1%', 
                      backgroundColor: !(this.state.predictionData) ?  'rgb(162, 162, 162)' : 'rgb(63, 124, 247)',
                      color: 'white'
                    }}
                    disabled={!(this.state.predictionData)}
                    onClick={this.uploadPredictionData}
                  >
                    Predict
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: "2%" }}>
          <Button 
            style={{  height:'5%', width: '8%', padding: '10px',marginLeft: '1%', marginTop: '1%', backgroundColor: 'rgb(63, 124, 247)', color: 'white' }}
            onClick={this.handleDownload}
          >
            Download
          </Button>
          <Button 
            style={{  height:'5%', width: '8%', padding: '10px',marginLeft: '1%', marginTop: '1%', backgroundColor: 'rgb(63, 124, 247)', color: 'white' }}
            onClick={this.showDeleteModalHandler}
          >
            Delete
          </Button>
          {this?.state?.deploymentApiResult && this?.state?.deploymentApiResult.length <= 0 ?
            <Button
              style={{  height:'5%', width: '8%', padding: '10px',marginLeft: '1%', marginTop: '1%', backgroundColor: 'rgb(63, 124, 247)', color: 'white' }} 
              onClick={this.handleShowDeploy}
            >
              Deploy
            </Button>
            :
            <div />
          }
        </div>
        <Backdrop
          style={{ zIndex: 1 }}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={this.state.showTestResult}
          onClose={this.handleDeleteModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Test score:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.testResult}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.setState({ showTestResult: false }) }} autoFocus>Close</Button>
          </DialogActions>
        </Dialog>
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
            <Button onClick={this.handleDelete} style={{ backgroundColor: 'red', color: 'white' }} autoFocus>Delete</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.showDeployModal}
          onClose={this.handleDeployModalClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          contentStyle={{
            width: '80%',
            maxWidth: 'none',
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {"Enter Deployment details"}
          </DialogTitle>
          <DialogContent>
            <div style={{ padding: "10px" }}>
              <TextField
                id="deploymentName"
                onChange={(e) => { !(e.target.value.length > 20) && this.setState({ deploymentName: e.target.value }) }}
                label="Deployment name"
                variant="outlined"
                value={this.state.deploymentName}
                required
              />
            </div>
            <div style={{ padding: "10px" }}>
              <TextField
                id="description"
                onChange={(e) => { !(e.target.value.length > 20) && this.setState({ description: e.target.value }) }}
                label="Description"
                variant="outlined"
                value={this.state.description}
                required
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeployModalClose}>Cancel</Button>
            <Button onClick={this.handleDeploy} disabled={this.state.description === '' || this.state.deploymentName === ''} autoFocus>Deploy</Button>
          </DialogActions>
        </Dialog>
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
