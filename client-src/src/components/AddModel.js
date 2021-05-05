import React from 'react';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Card
} from '@material-ui/core';

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

  render() {
    return (
      <div style={{ display: 'flex', height: '100%'}}>
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
            <div>
              params go here
            </div>
          </Card>
        </div>

        <div style={{ width: '33%' }}>
          <div>
            Upload training data here
        </div>
          <div>
            upload testing data here
          </div>
        </div>

        <div style={{ width: '33%' }}>
          Create model button goes here
        </div>
      </div>
    );
  }
}
