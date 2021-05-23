import React from 'react';
import NavBar from './NavBar';

export default class ViewModels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = async () => {
  }

  render() {
    return (
      <div>
        <NavBar />
        <h1>View Model Page</h1>
      </div>
    );
  }
}
