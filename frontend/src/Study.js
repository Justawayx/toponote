import Button from 'react-bootstrap/Button';
import React, {Component} from "react";
import Note from './components/Note';

class Study extends Component {
    constructor(props) {
      super(props);
      this.state = {
        formFilled: false,
        topic: "",
        otherPages: false,
        availablePrereqs: [],
        includedPrereqs: [],
        notes: []
      };
      this.studyTopic = React.createRef();
      this.otherPages = React.createRef();
      this.processInitialForm = this.processInitialForm.bind(this);
      this.processActualForm = this.processActualForm.bind(this);
    }
  
    processInitialForm() {
        console.log("topic: " + this.state.topic + ", other pages: " + this.state.otherPages);
        this.setState({ otherPages: this.otherPages })
        // fetch available prereqs and set state
    }

    addPrereq(p) {
        let joined = this.state.includedPrereqs.concat(p);
        this.setState({ topic: this.studyTopic, includedPrereqs: joined })
    }

    processActualForm() {
        // submit everything to toposort, set this.state.notes and this.state.formFilled
    }

    render() {
      console.log("study state: " + JSON.stringify(this.state));
      if (this.state.formFilled) {
          return (
            <div>
                {this.state.notes.map(n => {
                    return <Note title={n.title} body={n.body} tags={n.tags.join(", ")} prereqs={n.prereqs.join(", ")}/>
                })}
            </div>
          );
      } else if (!this.state.topic || !this.state.topic.length) {
        return (
            <div>
              <form onSubmit={this.processInitialForm}>
                <label>Study Topic:
                    <input type="text" ref={this.studyTopic}/>
                </label>
                <label>Include Outside Pages?
                    <input type="checkbox" ref={this.otherPages}/>
                </label>
                <input type="submit" name="Next"/>
              </form>
            </div>
          );
      } else {
          return (
            <div>
                <form onSubmit={this.processActualForm}>
                <label>Prereqs to Cover:
                    {this.state.availablePrereqs.map(p => {
                        return <div>{p} <input type="checkbox" onChange={()=>this.addPrereq(p)}/></div>
                    })}
                </label>
                <input type="submit" name="Make Study Guide!"/>
                </form>
            </div>
          )
      }
    }
  }
  
  export default Study;