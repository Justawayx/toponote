import React, {Component} from "react";
import Note from './components/Note';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './App.css';

class Pages extends Component {
    constructor(props) {
      super(props);
      this.state = {
        curr_page_name: "",
        curr_page_id: -1,
        notes: [],
        pages: [],
        curr_note: ""
      };
      this.newPageName = React.createRef();
      this.newNoteName = React.createRef();
      this.newNoteTags = React.createRef();
      this.newNotePrereqs = React.createRef();
      this.handleClick = this.handleClick.bind(this);
      this.getPages = this.getPages.bind(this);
      this.deletePage = this.deletePage.bind(this);
      this.createNote = this.createNote.bind(this);
    }

    componentDidMount() {
        this.getPages();
    }

    getPages() {
        fetch("http://localhost:9000/pages", { method: 'GET' })
            .then(response => {
                console.log("response: " + JSON.stringify(response));
                return response.json();
            })
            .then(data => {
                console.log("data: " + JSON.stringify(data));
                this.setState({ pages: data });
            });
    }

    handleClick(page) {
        let pageId = page.id;
        let pageName = page.name;
        fetch("http://localhost:9000/notes?q=" + pageId)
            .then(response => response.json())
            .then(data => {
                console.log("BRUH " + JSON.stringify(data));
                this.setState({ notes: data, curr_page_id: pageId, curr_page_name: pageName });
            });
    }

    createPage(pageName) {
        fetch("http://localhost:9000/pages?q=" + pageName, { method: 'POST' })
        .then(() => {
            this.forceUpdate();
        });
    }

    deletePage(pageId) {
        fetch("http://localhost:9000/pages/" + pageId, { method: 'DELETE' })
        .then(() => {
            this.forceUpdate();
        });
    }

    createNote() {
        fetch("http://localhost:9000/notes/", {
            method: 'POST',
            body: {
                'title': this.newNoteName,
                'body': this.state.curr_note,
                'tags': this.newNoteTags.toLowerCase().split(",").map(Function.prototype.call, String.prototype.trim),
                'prereqs': this.newNotePrereqs.toLowerCase().split(",").map(Function.prototype.call, String.prototype.trim)
            }
        }).then(() => this.forceUpdate());  
    }

    render() {
      console.log("state: " + JSON.stringify(this.state));
      if (this.state.curr_page_name !== -1 && this.state.curr_page_name !== "") {
        // render notes
        return (
            <div>
                <h1>Notes for {this.state.curr_page_name}</h1>
                {/* if no notes, say "You have no notes in this page yet" */}
                {this.state.notes.map(n => {
                    return <Note title={n.title} body={n.body} tags={n.tags.join(", ")} prereqs={n.prereqs.join(", ")}/>
                })}

                <form onSubmit={this.createNote}>
                <label>Subject
                    <input type="text" ref={this.newNoteName} />
                </label>
                <br/>
                <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onChange={ ( event, editor ) => {this.setState({ curr_note: editor.getData() });} }
                />
                <br/>
                <label>Tags
                    <input type="text" placeholder="comma separated" ref={this.newNoteTags} />
                </label>
                <br/>
                <label>Prereqs
                    <input type="text" placeholder="comma separated" ref={this.newNotePrereqs} />
                </label>
                <br/>
                <input type="submit" name="Submit"/>
                </form>
            </div>
        );
      } else {
        return (
            <div>
                <h1>My Pages</h1>

                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Page Name</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.pages.map(p => {
                        return (
                            <tr>
                            <td><a onClick={()=>this.handleClick(p)}>{p.name}</a></td>
                            <td><Button onClick={()=>this.deletePage(p.id)}>Delete</Button></td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                <form onSubmit={this.createPage}>
                    <label>New Page Title: 
                        <input type="text" ref={this.newPageName}/>
                    </label>
                    <input type="submit" name="Submit"/>
                </form>
            </div>
        );
      }
    }
  }
  
  export default Pages;