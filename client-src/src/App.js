import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import ViewModels from './components/ViewModels';
import AddModel from './components/AddModel';
import CreateAccount from './components/CreateAccount';
import Model from './components/Model';
import Login from './components/Login';

require('dotenv').config()

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/viewmodel" component={ViewModels}></Route>
        <Route exact path="/addmodel" component={AddModel}></Route>
        <Route exact path="/model/:id" component={Model}></Route>
        <Route exact path="/createaccount" component={CreateAccount}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
