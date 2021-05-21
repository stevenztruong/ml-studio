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

export default class AddModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: 'knn'
    };
  }

  componentDidMount = async () => {
  }

  handleSelectedModelChange = (e) => {
    this.setState({ selectedModel: e.target.value });
  }

  handleCreateModel = () => {

  }

  handle

  renderModelParameters = () => {
    if (this.state.selectedModel === 'knn') {
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Model Parameters</FormLabel>
          <RadioGroup aria-label="parameters" name="parameters" value={this.state.selectedModel} onChange={this.handleSelectedModelChange}>
            <FormControlLabel labelPlacement='start' label="Layers: " control={<TextField style={{ marginLeft: '10px' }} value={this.state.knnLayers} onChange={(e) => this.setState({ knnLayers: e.target.value })} />} />
          </RadioGroup>
        </FormControl>
      )
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: '33%', height: '100%' }}>
            <Card style={{ height: '50%' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select a model:</FormLabel>
                <RadioGroup aria-label="model" name="model" value={this.state.selectedModel} onChange={this.handleSelectedModelChange}>
                  <FormControlLabel value="knn" control={<Radio />} label="KNN" />
                  <FormControlLabel value="svm" control={<Radio />} label="SVM" disabled />
                </RadioGroup>
              </FormControl>
            </Card>
            <Card style={{ height: '50%' }}>
              {this.renderModelParameters()}
            </Card>
          </div>

          <div style={{ width: '33%' }}>
            <div style={{ padding: "10px" }}>
              Upload training data:
              <input type="file"
                id="uploadTrainingData"
                accept="file/json" onChange={this.updateTrainingData} required />
            </div>
            <div style={{ padding: "10px" }}>
              Upload testing data:
              <input type="file"
                id="uploadTestingData"
                accept="file/json" onChange={this.updateTestingData} required />
            </div>
          </div>

          <div style={{ width: '33%' }}>
            <Button onClick={this.handleCreateModel}>Create Model</Button>
          </div>
        </div>
      </div>
    );
  }
}
