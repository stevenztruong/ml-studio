import React from 'react';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Card,
  Button,
  TextField,
  Checkbox,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';

import NavBar from './NavBar';
import axios from 'axios';

export default class AddModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: 'SVM',
      modelName: "",
      selectedParameters: {},
      showLoading: false,
    };
  }

  componentDidMount = async () => {
  }

  handleSelectedModelChange = (e) => {
    this.setState({ selectedModel: e.target.value });
  }

  uploadData = async () => {
    this.setState({showLoading: true});
    let form_data = new FormData();
    form_data.append('trainingData', this.state.trainingData)
    form_data.append('classificationData', this.state.classificationData)

    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/data',
      form_data,
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      },
    ).then(async res => {
      await this.createModelApiCall(
        res.data.training_data,
        res.data.classification_data
      );
    }).catch(error => {
      this.setState({showLoading: false});
      alert(error);
    })
  }

  createModelApiCall = async (trainingDataPath, classificationDataPath) => {
    this.setState({showLoading: true});
    let filteredSelectedParameters = Object.fromEntries(Object.entries(this.state.selectedParameters).filter(([_, val]) => val != ''));
    if (this.state.selectedModel === 'Multinomial Naive Bayes') {
      if (!filteredSelectedParameters?.naiveBayesGaussianFitPrior) {
        filteredSelectedParameters['naiveBayesGaussianFitPrior'] = 'False';
      }
    }

    await axios.post(
      process.env.REACT_APP_BACKEND_API_URL + '/v1/models',
      {
        userId: 1,
        modelType: this.state.selectedModel,
        parameters: filteredSelectedParameters,
        trainingData: trainingDataPath,
        classificationData: classificationDataPath,
        modelName: this.state.modelName,
      },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }
    ).then(res => {
      this.setState({showLoading: false});
      alert("Model creation in progress!")
      window.location = '/';
    }).catch(error => {
      this.setState({showLoading: false});
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
          style={{ width: '70%' }}
          id="modelName"
          onChange={(e) => { !(e.target.value.length > 20) && this.setState({ modelName: e.target.value }) }}
          label="Model Name"
          variant="outlined"
          value={this.state.modelName}
          error={this.state?.modelName?.length >= 20}
          helperText={"Length cannot exceed 20 characters"}
        />
      </div>
    )
  }

  setParameters = (parameterName, parameter) => {
    let newParameters = { ... this.state.selectedParameters };
    newParameters[parameterName] = parameter;
    this.setState({ selectedParameters: newParameters });
  }

  renderModelParameters = () => {
    if (this.state.selectedModel === 'SVM') {
      return this.renderSvmParameters();
    }
    else if (this.state.selectedModel === 'Gaussian Naive Bayes') {
      return this.renderGaussianNBParameters();
    }
    else if (this.state.selectedModel === 'Multinomial Naive Bayes') {
      return this.renderMultinomialNBParameters();
    }
    else if (this.state.selectedModel === 'Decision Tree Classifier') {
      return this.renderDecisionTreeClassifierParameters();
    }
    else if (this.state.selectedModel === 'Multi-layer Perceptron Classifier') {
      return this.renderMLPClassifierParameters();
    }
    else if (this.state.selectedModel === 'KNN') {
      return this.renderKnnParameters();
    }
    else {
      return <div />;
    }
  }

  renderSvmParameters = () => {
    return (
      <div>
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="SVMCParam"
            onChange={(e) => { (e.target.value === '' || e.target.value >= 0) && this.setParameters('svmCParam', e.target.value) }}
            label="C"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.svmCParam}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="SVMMaxIterations"
            onChange={(e) => { (e.target.value >= -1 || e.target.value === '') && this.setParameters('svmMaxIterations', e.target.value) }}
            label="Max iterations"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.svmMaxIterations}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Kernel:</FormLabel>
            <RadioGroup aria-label="model" name="model" value={this.state?.selectedParameters?.svmKernel} onChange={(e) => this.setParameters('svmKernel', e.target.value)}>
              <FormControlLabel value="linear" control={<Radio />} label="Linear" />
              <FormControlLabel value="poly" control={<Radio />} label="Polynomial" />
              <FormControlLabel value="rbf" control={<Radio />} label="RBF" />
              <FormControlLabel value="sigmoid" control={<Radio />} label="Sigmoid" />
              <FormControlLabel value="precomputed" control={<Radio />} label="Precomputed" />
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{ padding: "2%" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gamma:</FormLabel>
            <RadioGroup aria-label="model" name="model" value={this.state?.selectedParameters?.svmGamma} onChange={(e) => this.setParameters('svmGamma', e.target.value)}>
              <FormControlLabel value="scale" control={<Radio />} label="Scale" />
              <FormControlLabel value="auto" control={<Radio />} label="Auto" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    )
  }

  renderGaussianNBParameters = () => {
    return (
      <div style={{ padding: "2%" }}>
      </div>
    )
  }

  renderMultinomialNBParameters = () => {
    return (
      <div>
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="naiveBayesGaussianAlpha"
            onChange={(e) => { (e.target.value === '' || e.target.value >= 0) && this.setParameters('naiveBayesGaussianAlpha', e.target.value) }}
            label="Alpha"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.naiveBayesGaussianAlpha}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <FormControlLabel
            label="Fit Prior"
            control={
              <Checkbox
                checked={this.state?.selectedParameters?.naiveBayesGaussianFitPrior === 'True'}
                onChange={(e) => e.target.checked ? this.setParameters('naiveBayesGaussianFitPrior', 'True') : this.setParameters('naiveBayesGaussianFitPrior', 'False')}
              />
            }
          />
        </div>
      </div>
    )
  }

  renderDecisionTreeClassifierParameters = () => {
    return (
      <div>
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="decisionTreeMaxDepth"
            onChange={(e) => { (e.target.value === '' || e.target.value > 0) && this.setParameters('decisionTreeMaxDepth', e.target.value) }}
            label="Max depth"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.naiveBayesGaussianAlpha}
          />
        </div>
      </div>
    )
  }

  renderMLPClassifierParameters = () => {
    return (
      <div>
        {/* <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="MLPTotalLayers"
            onChange={(e) => { this.setParameters('mlpTotalLayers', e.target.value) }}
            label="Total Layers"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.mlpTotalLayers}
          />
        </div> */}
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="MLPHiddenLayers"
            onChange={(e) => { this.setParameters('mlpHiddenLayers', e.target.value) }}
            label="Hidden Layers"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.mlpHiddenLayers}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="MLPIterationCount"
            onChange={(e) => { this.setParameters('mlpMaximumIterations', e.target.value) }}
            label="Maximum Training Iterations"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.mlpMaximumIterations}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Activation Function:</FormLabel>
            <RadioGroup aria-label="model" name="model" value={this.state?.selectedParameters?.mlpActivationFunction} onChange={(e) => this.setParameters('mlpActivationFunction', e.target.value)}>
              <FormControlLabel value="identity" control={<Radio />} label="Identity" />
              <FormControlLabel value="logistic" control={<Radio />} label="Logistic" />
              <FormControlLabel value="tanh" control={<Radio />} label="TANH" />
              <FormControlLabel value="relu" control={<Radio />} label="RELU" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    )
  }

  renderKnnParameters = () => {
    return (
      <div>
        <div style={{ padding: "2%" }}>
          <TextField
            style={{ width: '70%' }}
            id="knnNNearestNeighbors"
            onChange={(e) => { this.setParameters('knnNNearestNeighbors', e.target.value) }}
            label="Nearest Neighbors Count"
            variant="outlined"
            type="number"
            value={this.state?.selectedParameters?.knnNNearestNeighbors}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Weights function:</FormLabel>
            <RadioGroup aria-label="model" name="model" value={this.state?.selectedParameters?.knnWeightsFunction} onChange={(e) => this.setParameters('knnWeightsFunction', e.target.value)}>
              <FormControlLabel value="uniform" control={<Radio />} label="Uniform" />
              <FormControlLabel value="distance" control={<Radio />} label="Distance" />
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{ padding: "2%" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Algorithm:</FormLabel>
            <RadioGroup aria-label="model" name="model" value={this.state?.selectedParameters?.knnAlgorithm} onChange={(e) => this.setParameters('knnAlgorithm', e.target.value)}>
              <FormControlLabel value="auto" control={<Radio />} label="Auto" />
              <FormControlLabel value="ball_tree" control={<Radio />} label="Ball Tree" />
              <FormControlLabel value="kd_tree" control={<Radio />} label="KD Tree" />
              <FormControlLabel value="brute" control={<Radio />} label="Brute" />
            </RadioGroup>
          </FormControl>
        </div>
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
                  <FormControlLabel value="SVM" control={<Radio />} label="SVM" />
                  <FormControlLabel value="Gaussian Naive Bayes" control={<Radio />} label="Gaussian Naive Bayes" />
                  <FormControlLabel value="Multinomial Naive Bayes" control={<Radio />} label="Multinomial Naive Bayes" />
                  <FormControlLabel value="Decision Tree Classifier" control={<Radio />} label="Decision Tree Classifier" />
                  <FormControlLabel value="Multi-layer Perceptron Classifier" control={<Radio />} label="Multi-layer Perceptron Classifier" />
                  <FormControlLabel value="KNN" control={<Radio />} label="KNN" />
                </RadioGroup>
              </FormControl>
            </Card>
            <Card style={{ height: '50%', padding: "2%", marginTop: '4%' }}>
              <FormLabel component="legend">Model parameters:</FormLabel>
              {this.renderModelName()}
              <div></div>
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
            <Button
              onClick={this.uploadData}
              disabled={
                !(
                  this.state.modelName
                  && this.state.modelName != ''
                  && this.state.trainingData
                  && this.state.classificationData
                  )
                }
              >
                Create Model
              </Button>
          </div>
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
