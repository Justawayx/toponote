import React, {Component} from "react";
import Note from './components/Note';
import './App.css';

class Classes extends Component {
    constructor(props) {
      super(props);
      this.state = {
        curr_class: "",
        notes: [],
        classes: []
      };
      this.getClasses = this.getClasses.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.setState({ curr_class: "", notes: [] });
        this.getClasses();
    }

    getClasses() {
        fetch("http://localhost:9000/classes")
            .then(response => response.json())
            .then(data => {
                this.setState({ classes: data })
            });
    }

    handleClick(className) {
        fetch("http://localhost:9000/classes/getnotes")
            .then(response => response.json())
            .then(data => {
                this.setState({ notes: data, curr_class: className });
            });
    }

    render() {
      if (this.state.curr_class.length > 0) {
        // render notes
        return (
            <div>
                <h1>Notes for {this.state.curr_class}</h1>
                {this.state.notes.map(n => {
                    return <Note title={n.title} body={n.body} tags={n.tags} prereqs={n.prereqs}/>
                })}
            </div>
        );
      } else {
        return (
            <div>
                <h1>My Classes!</h1>
                <ul>
                    {this.state.classes.map(c => {
                        return <li onClick={this.handleClick} data-id={c} key={c}>{c}</li>
                    })}
                </ul>
            </div>
        );
      }
    }
  }
  
  export default Classes;