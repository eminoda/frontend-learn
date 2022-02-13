import React, { Component } from "react";
import "./App.css";
import ThemeSetting from "./advance/context/ThemeSetting";
import FunctionLifeCycle from "./advance/lifecycle/FunctionLifeCycle";
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1> Hello, World! </h1>
        <div className="logo">
          <div className="logo-text">
            <div className="text1">前端</div>
            <div className="text2">
              90<span className="icon">′</span>
            </div>
            <div className="text3">NextInnovation</div>
          </div>
        </div>
        <ThemeSetting />
        <FunctionLifeCycle />
      </div>
    );
  }
}

export default App;
