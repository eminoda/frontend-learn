import React, { Component } from 'react';
import './App.css';
import ThemeSetting from './advance/context/ThemeSetting';
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1> Hello, World! </h1>
        <ThemeSetting />
      </div>
    );
  }
}

export default App;
