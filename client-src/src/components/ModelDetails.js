import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Backdrop,
  CircularProgress,
  Card,
  Button,
  TextField
} from '@material-ui/core';

import NavBar from './NavBar';
import axios from 'axios';

export default class ModelDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: 'svm',
      modelName: "",
      showLoading: false
    };
  }

  componentDidMount = async () => {
    let splitPath = window.location.pathname.split('/');
    let modelId = splitPath[splitPath.length - 1];
    if (modelId) {
      await axios.get(
        process.env.REACT_APP_BACKEND_API_URL + '/v1/models/' + modelId,
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
          }
        }
      ).then(async res => {
        console.log(JSON.stringify(res));
      }).catch(error => {
        alert(error);
      })
    }
    else {
      alert("Failed to retrieve model id");
      window.location = '/';
    }
  }

  handleSelectedModelChange = (e) => {
    this.setState({ selectedModel: e.target.value });
  }

  uploadTestingAndClassificationData = async () => {
    let form_data = new FormData();
    form_data.append('testingData', this.state.testingData)
    form_data.append('classificationData', this.state.classificationData)

    await axios.post(
      //TODO: Upload data using correct path
      // process.env.REACT_APP_BACKEND_API_URL + '/v1/data',
      form_data
    ).then(async res => {
      await this.testAgainstModelApiCall(
        res.data.training_data,
        res.data.classification_data
      );
    }).catch(error => {
      alert(error);
    })
  }

  testAgainstModelApiCall = async (testingDataPath, classificationDataPath) => {
    await axios.post(
      // TODO: Call the API to test against the model and pass correct parameters
      // process.env.REACT_APP_BACKEND_API_URL + '/v1/models',
      {
        userId: 1,
        modelType: this.state.selectedModel,
        parameters: {},
        testingData: testingDataPath,
        classificationData: classificationDataPath,
        modelName: this.state.modelName
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(res => {
      alert("Model creation in progress!")
      window.location = '/';
    }).catch(error => {
      alert(error);
    })
  }

  uploadPredictionData = async () => {
    let form_data = new FormData();
    form_data.append('predictionData', this.state.testingData)

    await axios.post(
      // TODO: Upload data using correct path
      // process.env.REACT_APP_BACKEND_API_URL + '/v1/data',
      form_data,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(async res => {
      await this.predictAgainstModelApiCall(
        res.data.prediction_data,
      );
    }).catch(error => {
      alert(error);
    })
  }

  predictAgainstModelApiCall = async (predictionDataPath) => {
    await axios.post(
      // TODO: Call the API to predict against the model and pass correct parameters
      // process.env.REACT_APP_BACKEND_API_URL + '/v1/models',
      {
        userId: 1,
        modelType: this.state.selectedModel,
        parameters: {},
        predictionData: predictionDataPath,
        modelName: this.state.modelName
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(res => {
      alert("Model creation in progress!")
      window.location = '/';
    }).catch(error => {
      alert(error);
    })
  }

  updateTestingData = e => {
    this.setState({
      testingData: e.target.files[0],
    })
  }

  updateClassificationData = e => {
    this.setState({
      classificationData: e.target.files[0],
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

  handleDownload = () => {
    this.setState({ showLoading: true });
  }

  handleDelete = () => {
    this.setState({ showLoading: true });
  }

  handleDeploy = () => {
    this.setState({ showLoading: true });
  }

  render() {
    return (
      <div>
        <NavBar />
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: '33%', height: '100%', padding: "2%" }}>
            <Card style={{ height: '50%', padding: "2%" }}>
              <p>Model Type:</p>
              <p>Status:</p>
              <p>Training input size:</p>
              <p>Testing input size:</p>
              <p>Prediction status:</p>
            </Card>
          </div>
          <div style={{ width: '33%', padding: "2%" }}>
            <Card style={{ padding: "2%", marginBottom: "5%" }}>
              <FormLabel component="legend">Upload testing and classification data:</FormLabel>
              <div style={{ 'display': 'inline-flex' }}>
                <div>
                  <div style={{ padding: "10px" }}>
                    Testing data (.json): &nbsp;
                    <input type="file"
                      id="uploadtestingData"
                      accept="application/JSON" onChange={this.updateTestingData} required />
                  </div>
                  <div style={{ padding: "10px" }}>
                    Prediction data (.json): &nbsp;
                    <input type="file"
                      id="uploadClassificationData"
                      accept="application/JSON" onChange={this.updateClassificationData} required />
                  </div>
                </div>
                <Button onClick={this.handleSubmitTestingAndClassification}>Test</Button>
              </div>
            </Card>
            <Card style={{ padding: "2%", marginBottom: "5%" }}>
              <FormLabel component="legend">Upload prediction data:</FormLabel>
              <div style={{ 'display': 'inline-flex' }}>
                <div style={{ padding: "10px" }}>
                  Prediction data (.json): &nbsp;
                  <input type="file"
                    id="uploadpredictionData"
                    accept="application/JSON" onChange={this.updatePredictionData} required />
                </div>
                <Button onClick={this.handleSubmitPrediction}>Predict</Button>
              </div>
            </Card>
          </div>
        </div>
        <div style={{ padding: "2%" }}>
          <Button onClick={this.handleDownload}>Download</Button>
          <Button onClick={this.handleDelete}>Delete</Button>
          <Button onClick={this.handleDeploy}>Deploy</Button>
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
