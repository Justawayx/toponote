import React, {Component} from "react";
import Note from './components/Note';
import './App.css';

class Pages extends Component {
    constructor(props) {
      super(props);
      this.state = {
        curr_page: "",
        notes: [],
        pages: []
      };
      this.getPages = this.getPages.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.setState({ curr_page: "", notes: [] });
        this.getPages();
    }

    getPages() {
        fetch("http://localhost:9000/pages")
            .then(response => response.json())
            .then(data => {
                this.setState({ pages: data })
            });
    }

    handleClick(pageName) {
        fetch("http://localhost:9000/pages/getnotes")
            .then(response => response.json())
            .then(data => {
                this.setState({ notes: data, curr_page: pageName });
            });
    }

    render() {
      if (this.state.curr_page.length > 0) {
        // render notes
        return (
            <div>
                <h1>Notes for {this.state.curr_page}</h1>
                {this.state.notes.map(n => {
                    return <Note title={n.title} body={n.body} tags={n.tags} prereqs={n.prereqs}/>
                })}
            </div>
        );
      } else {
        return (
            <div>
                <h1>My Pages</h1>
                <ul>
                    {this.state.pages.map(p => {
                        return <li onClick={this.handleClick} data-id={p} key={p}>{p}</li>
                    })}
                </ul>
            </div>
        );
      }
    }
  }
  
  export default Pages;