//import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Loading from './components/loader';
import App from './data_grabber';
import reportWebVitals from './reportWebVitals';
let loading = false;

//Your div with id template needs to get all the info variables and pass them down instead of being in report

ReactDOM.render(
    (loading)?<Loading /> :
        <App />,
    document.getElementById('root')
);
    
    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
