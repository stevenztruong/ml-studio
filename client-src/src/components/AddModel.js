import React from 'react';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Card,
  Button,
  TextField
} from '@material-ui/core';

import NavBar from './NavBar';
import axios from 'axios';

export default class AddModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: 'svm',
      modelName: ""
    };
  }

  componentDidMount = async () => {
  }

  handleSelectedModelChange = (e) => {
    this.setState({ selectedModel: e.target.value });
  }

  uploadData = async () => {
    let form_data = new FormData();
    form_data.append('trainingData', this.state.trainingData)
    form_data.append('classificationData', this.state.classificationData)

    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/data',
      form_data
    ).then(async res => {
      await this.createModelApiCall(
        res.data.trainingData,
        res.data.classificationData
      );
    }).catch(error => {
      alert(error);
    })
  }

  createModelApiCall = async (trainingDataPath, classificationDataPath) => {
    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/models',
      {
        modelType: this.state.selectedModel,
        parameters: {},
        trainingData: trainingDataPath,
        classificationData: classificationDataPath,
        modelName: this.state.modelName
      }
    ).then(res => {
      alert("Model creation in progress!")
      window.location = '/';
    }).catch(error => {
      alert(error);
    })
  }

  updateTrainingData = e => {
    this.setState({
      trainingData: e.target.files[0],
    })
  }

  updateClassificationData = e => {
    this.setState({
      classificationData: e.target.files[0],
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

  render() {
    return (
      <div>
        <NavBar />
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: '33%', height: '100%', padding: "2%" }}>
            <Card style={{ height: '50%', padding: "2%" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select a model:</FormLabel>
                <RadioGroup aria-label="model" name="model" value={this.state.selectedModel} onChange={this.handleSelectedModelChange}>
                  <FormControlLabel value="svm" control={<Radio />} label="SVM" />
                  <FormControlLabel value="knn" control={<Radio />} label="KNN" disabled />
                </RadioGroup>
              </FormControl>
            </Card>
            <Card style={{ height: '50%', padding: "2%" }}>
              {this.renderModelName()}
              <div ></div>
              {this.renderModelParameters()}
            </Card>
          </div>
          <div style={{ width: '33%', padding: "2%" }}>
            <Card style={{ padding: "2%" }}>
              <FormLabel component="legend">Upload data:</FormLabel>
              <div style={{ padding: "10px" }}>
                Training data (.json): &nbsp;
              <input type="file"
                  id="uploadTrainingData"
                  accept="application/JSON" onChange={this.updateTrainingData} required />
              </div>
              <div style={{ padding: "10px" }}>
                Classification data (.json): &nbsp;
              <input type="file"
                  id="uploadClassificationData"
                  accept="application/JSON" onChange={this.updateClassificationData} required />
              </div>
            </Card>
          </div>

          <div style={{ width: '33%', padding: "2%" }}>
            <Button onClick={this.uploadData}>Create Model</Button>
          </div>
        </div>
      </div>
    );
  }
}
