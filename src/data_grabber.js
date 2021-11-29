// JavaScript source code
import React, { useState, useEffect } from 'react';
import Report from './components/Report';
import Header from './components/Header';
import Alerts from './components/Alerts';

/*
 * :::::::::::::::::::::API INFORMATION
 * https://www.weather.gov/documentation/services-web-api
 * 
 * get station info from both zone and stations, compare coordinates to current for best info
*/
//NOTE: if latlon is not set, app will not work. Need to handle errors, besides just presetting the latlon object
export default function App() {
    const [weather_data, setWeather_data] = useState({});
    const [weather_zone, setWeather_zone] = useState('');
    //const [latlon, setLatlon] = useState({ lat: 46.832, lon: -122.538 });
    const [latlon, setLatlon] = useState({ lat: 46.832, lon: -122.534 });
    const [update, setUpdate] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const generateReport = () => {
        console.log('generated report effect');
        setIsActive(false);
        let coords = document.getElementById("coord_input").value;
        console.log(coords);
        if (coords) {
            //get both coordinate values
            let arr = coords.split(",");
            //make input coordinates float values with 3 decimal place precision
            let latitude = Number(parseFloat(arr[0]).toFixed(3));
            let longitude = Number(parseFloat(arr[1]).toFixed(3));
            setLatlon({ lat: latitude, lon: longitude },console.log(latlon));
        } else {
            throw Error("Coordinates must be in (number, number) format.");
        }
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            //console.log('update effect when active timer');
            interval = setInterval(() => {
                setUpdate(update => update + 1);
           }, 5000);
        } else if (!isActive && update !== 0) { //make a turn off condition based on code later
            //console.log('update effect when inactive timer');
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, update]);
    /*if (Math.abs(position.coords.latitude - latlon.lat) > .02 || Math.abs(position.coords.longitiude - latlon.lon) > .02) {
    setLatlon({ lat: position.coords.latitude, lon: position.coords.longitude }, console.log(latlon));
    } */
    useEffect(() => {
        function getPos() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let latitude = Number(position.coords.latitude.toFixed(3));
                    let longitude = Number(position.coords.longitude.toFixed(3));
                    setLatlon({ lat:latitude, lon: longitude });
               });
            }
        }
        if (isActive) {
            getPos();
        }
    }, [update]); //this is changing on update ;(

    useEffect(() => {
            const api = async function fetchData() {
                console.log('fetching new data');
                //get input coordinates
                let reference = `https://api.weather.gov/points/${latlon.lat},${latlon.lon} `;
                let response = await fetch(reference);
                let result = await response.json();
                let forecastUrl = result.properties.forecast;
                console.log(forecastUrl);
                setWeather_zone(result.properties.forecastZone);
                response = await fetch(forecastUrl);
                result = await response.json();
                setWeather_data(result.properties.periods[2]);
                console.log(result.properties.updateTime);
            }
            api();
    }, [update, isActive]);     //the dependecy was weather_data, we want to limit the calls and this was too constantly changing


    //change latlon useEffect on click to get report, so onClick itself will set a boolean in it's function and update the latlon obj
    //at this point interval will be paused and timed updates should stop until reverted to myLocation

    return (
        <div id="template">
            <React.StrictMode>
                <Header />
                <Report weatherData={weather_data} currentPosition={latlon} generator={generateReport} />
                <Alerts zone={weather_zone} />
            </React.StrictMode>
        </div>
        );
}