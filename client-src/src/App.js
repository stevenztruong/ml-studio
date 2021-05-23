import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import ViewModels from './components/ViewModels';
import AddModel from './components/AddModel';

require('dotenv').config()

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={ViewModels}></Route>
        <Route exact path="/addmodel" component={AddModel}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
