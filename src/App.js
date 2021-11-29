import React from 'react';
import { useState } from 'react';
class AppCL extends React.Component {
    constructor() {
        super();
        this.state = {
            area: ['Write whatever you want:'],
            text: 'Default text'
        };
        this.add = (elem) => {
            let val = elem.target.value;
            this.setState({text: val});
        }
        this.update = () => {
            let val= [this.state.area, ' '+this.state.text];
            this.setState({ area: val });
        }
    }
    render() {
        return (
            <div id="app">
                <p>{this.state.area}</p>
                <input id="Xer" onChange={this.add} value={this.state.text} />
                <button onClick={this.update}> Upload Text </button>
            </div>
        );
    };
}
export default AppCL;
/* if input onChange=true this.change to input value*/