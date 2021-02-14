import Button from 'react-bootstrap/Button';
import React, {Component} from "react";
import SearchField from "react-search-field";
import logo from './logo.svg';
import './App.css';

class Home extends Component {
    constructor(props) {
      super(props);
      this.onSearchEnter = this.onSearchEnter.bind(this);
      this.onSearchSubmit = this.onSearchSubmit.bind(this);
      this.makeStudyGuide = this.makeStudyGuide.bind(this);
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
        </div>
      );
    }
  }
  
  export default Home;