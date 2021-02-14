import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Pages from './Pages';
import Home from './Home';
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/Pages" component={Pages} />
                </Switch>
            </Router>
        )
    }
}