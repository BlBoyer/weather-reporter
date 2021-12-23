// JavaScript source code
import React, { useState, useEffect } from 'react';
import ReactDOM, { render } from 'react-dom';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Report from './components/Report';
import Header from './components/Header';
import Alerts from './components/Alerts';
import InfoBar from './components/infobar';
//import { Redirect } from 'react-router';

/*
 * :::::::::::::::::::::API INFORMATION
 * https://www.weather.gov/documentation/services-web-api
 * 
 * get station info from both zone and stations, compare coordinates to current for best info
*/
//NOTE: if latlon is not set, app will not work. Need to handle errors, besides just presetting the latlon object
export default function App() {
    const [report_data, setReport_data] = useState({});
    const [weather_data, setWeather_data] = useState({});
    const [weather_zone, setWeather_zone] = useState('');
    //const [latlon, setLatlon] = useState({ lat: 46.832, lon: -122.538 });
    const [latlon, setLatlon] = useState({});
    const [update, setUpdate] = useState(0);
    const SEC = 1000;
    //const MINS = 60000;
    //const HR = 3600000;
    const [intDelay, setIntDelay] = useState(SEC*2.5);
    const [isActive, setIsActive] = useState(true);
    const Refresh = () => {
        setIntDelay(SEC);
        setIsActive(true);
    }
    const generateReport = () => {
        setIsActive(false);
        let coords = document.getElementById("coord_input").value;
        //console.log(coords);
        if (coords) {
            //get both coordinate values
            let arr = coords.split(",");
            //make input coordinates float values with 3 decimal place precision
            let latitude = Number(parseFloat(arr[0]).toFixed(3));
            let longitude = Number(parseFloat(arr[1]).toFixed(3));
            setLatlon({ lat: latitude, lon: longitude });
        } else {
            throw Error("Coordinates must be in (number, number) format.");
        }
    }
    const RenderInv = () => {
        render(
            <div id="invalid-page">
                <p>Sorry, the location you've requested is currently unavailable. We are working to fix this.</p>
                <button onClick={()=>window.location.reload()}>Refresh Position</button>
            </div>,
            document.getElementById('root')
        );
    }
    useEffect(() => {
        let interval = null;
        if (isActive) {
            //console.log('update effect when active timer');
            interval = setInterval(() => {
                setUpdate(update => update + 1);
            }, intDelay);
        } else if (!isActive && update !== 0) { //make a turn off condition based on code later
            //console.log('update effect when inactive timer');
            clearInterval(interval);
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, update]);

    useEffect(() => {
        function getPos() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let latitude = Number(position.coords.latitude.toFixed(3));
                    let longitude = Number(position.coords.longitude.toFixed(3));
                    setLatlon({ lat: latitude, lon: longitude });
                });
            }
        }
        if (isActive) {
            getPos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update]);

    useEffect(() => {
        //eliminate first call with update>0, we can use latlon or update to change this
        if (update > 0) {
            const api = async function fetchData() {
                console.log(`fetching new data for ${latlon.lat} ${latlon.lon}`);
                //get input coordinates
                let reference = `https://api.weather.gov/points/${latlon.lat},${latlon.lon}`;
                let response = await fetch(reference).catch(err => {
                    console.log(err);
                    Refresh();
                });
                let result = await response.json().catch(err => {
                    console.log(err);
                    Refresh();
                });
                if (result.status) {
                    //we're going to use a router and change the page to our own out of area page
                    if (isActive===true) {
                        setIsActive(false);
                    }
                    RenderInv();
                    console.log(result.status + ' ' + result.detail);
                    console.log('call other area if status == bad area');
                    /*
                     * reset update interval to 1 hour
                     * setIntDelay(HR);
                     * changeApi fetch call
                     * */
                }
                else if (result) {
                    if (intDelay !== SEC * 7) {
                        setIntDelay(SEC * 7);
                    }
                    let forecastUrl = result.properties.forecast;
                    if (forecastUrl) {
                        setWeather_zone(result.properties.forecastZone);
                        let response2 = await fetch(forecastUrl).catch(err => console.log(err));
                        let result2 = await response2.json();
                        /*
                          setWeather_data(result.properties.periods[0]);
                          this was problematic due to the dates changing when called
                        */
                        if (result2) {
                            setReport_data(result2.properties);
                            let currentTime = new Date();
                            let reportTime = result2.properties.generatedAt.slice(0, 16);
                            let periods = result2.properties.periods;
                            const checkTimes = async() => {
                                for (let ind in periods) {
                                    let period = periods[ind];
                                    let periodTime = [period.startTime, period.endTime];
                                    /*
                                     * if today and generated report occur on same date, UTC then the period is the same day,
                                     * reportTime is UTC
                                     * and the current day is equal to or later than the period start time(convert)
                                     * and the hours are the same as the report hours
                                     * NEED TO VERIFY THAT startTime is earlier than now and endTime is later than now
                                     */
                                    if (
                                        currentTime.toISOString().slice(0, 10) === reportTime.slice(0, 10) &&
                                        Date.now() > Date.parse(periodTime[0]) &&
                                        Date.now() < Date.parse(periodTime[1])
                                    ) {
                                        /* OLD
                                         * currentTime.toISOString().slice(0, 10) === new Date(periodTime[0].slice(0, -6)).toISOString().slice(0, 10) && 
                                         * currentTime.getHours() >= new Date(periodTime[0].slice(0,-6)).toISOString().slice(11, 13)*/
                                        //console.log('Report was generated within ' + (currentTime.toISOString().slice(11, 13) - reportTime.slice(11, 13)) + ' hour(s) ago');
                                        console.log(periodTime);
                                        setWeather_data(period);
                                        //remember that the state won't auto-update which is why we want variables here
                                        //break;
                                    }
                                }
                            }
                            checkTimes();
                        }
                    }
                }
            }
            api();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update, isActive]);     //the dependecy was weather_data, we want to limit the calls and this was too constantly changing

    return (
            <div>
                <InfoBar />
                <div id="template">
                    <Header />
                    <Report reportHeader={report_data} weatherData={weather_data} currentPosition={latlon} generator={generateReport} refresher={Refresh} />
                    <Alerts zone={weather_zone} />
                </div>
            </div>
    );
}