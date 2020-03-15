import React from 'react';
import {WebMapView} from './components/WebMapView';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return(
      <div className="App">
        <WebMapView />
      </div>
    )
  }
}


export default App;
