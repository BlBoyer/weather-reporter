import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './data_grabber';
import reportWebVitals from './reportWebVitals';

//Your div with id template needs to get all the info variables and pass them down instead of being in report

ReactDOM.render(
        <App />,
    document.getElementById('root')
);
    
    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
