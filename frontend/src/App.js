import Button from 'react-bootstrap/Button';
import React, {Component} from "react";
import SearchField from "react-search-field";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
    this.onSearchEnter = this.onSearchEnter.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.makeStudyGuide = this.makeStudyGuide.bind(this);
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
    this.callAPI();
  }

  makeStudyGuide(e) {
    console.log("making study guide!");
    console.log("event: " + e);
  }

  onSearchEnter(val, e) {
    console.log("event: " + e);
    this.onSearchSubmit(val);
  }

  onSearchSubmit(val) {
    console.log("searched for " + val);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>TopoNote</h1>
        </header>
        <SearchField placeholder="Search notes" onEnter={this.onSearchEnter} onSearchClick={this.onSearchSubmit}/>
        <br/>
        <Button variant="primary" size="lg" onClick={this.makeStudyGuide}>Make study guide</Button>
        <p className="App-intro">{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;
