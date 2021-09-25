import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import ViewModels from './components/ViewModels';
import AddModel from './components/AddModel';
import CreateAccount from './components/CreateAccount';

require('dotenv').config()

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={ViewModels}></Route>
        <Route exact path="/addmodel" component={AddModel}></Route>
        <Route exact path="/createaccount" component={CreateAccount}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
