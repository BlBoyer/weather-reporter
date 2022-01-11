// JavaScript source code
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
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
    const [three_day, setThree_day] = useState([]);
    const [weather_zone, setWeather_zone] = useState('');
    //const [latlon, setLatlon] = useState({ lat: 46.832, lon: -122.538 });
    const [latlon, setLatlon] = useState({});
    const [quake_data, setQuake_data] = useState([]);
    const [update, setUpdate] = useState(0);
    const SEC = 1000;
    const MIN = 60000;
    //const HR = 3600000;
    const [intDelay, setIntDelay] = useState(SEC * 3);
    const [isActive, setIsActive] = useState(true);
    const Refresh = () => {
        setIntDelay(SEC);
        setIsActive(true);
    }
    const generateReport = () => {
        setIsActive(false);
        let coords = document.getElementById("coord_input").value;
        //console.log(coords);
        let coordPx = /-*\d{1,2}(\.\d+)?,\s*-*\d{1,3}(\.\d+)?/;
        try {
            //force regex pattern on sring to be sure it doesn't have extra digits
            coords = coords.match(coordPx)[0];
            //get both coordinate values
            let arr = coords.split(",");
            //make input coordinates float values with 3 decimal place precision
            let latitude = Number(parseFloat(arr[0]).toFixed(3));
            let longitude = Number(parseFloat(arr[1]).toFixed(3));
            setLatlon({ lat: latitude, lon: longitude });
        } catch (err) {
            //update invalid div with this error text, need errorText state
            throw Error("Incorrect input. Format must be latitude number, longitude number");
        }
    }
    const RenderInv = () => {
        render(
            <div id="invalid-page">
                <p>Sorry, the location you've requested is currently unavailable. We are working to fix this.</p>
                <button onClick={() => window.location.reload()}>Refresh Position</button>
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
        //latlon is defined
        if (update > 0) {
            const api = async function fetchData() {
                console.log(`fetching new data for ${latlon.lat} ${latlon.lon}`);
                //get input coordinates
                let reference = `https://api.weather.gov/points/${latlon.lat},${latlon.lon}`;
                let response = await fetch(reference).catch(err => {
                    console.log(err);
                });
                let result = await response.json().catch(err => {
                    console.log(err);
                });
                if (result.status) {
                    //we're going to use a router and change the page to our own out of area page
                    if (isActive === true) {
                        setIsActive(false);
                    }
                    RenderInv();
                    console.log(result.status + ' ' + result.detail);
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
                            //don't use state var until updated
                            let reportTime = result2.properties.generatedAt.slice(0, 16);
                            let periods = result2.properties.periods;
                            const checkTimes = async () => {
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
                                        //console.log('Report was generated within ' + (currentTime.toISOString().slice(11, 13) - reportTime.slice(11, 13)) + ' hour(s) ago');
                                        console.log(periodTime);
                                        setWeather_data(period);
                                        setThree_day(periods.slice(period.number, period.number+6));
                                    }
                                }
                            }
                            checkTimes();
                        }
                    }
                }
            }
            api();
            //if quakedata is set || update = one hour of 7 sec updates (85)
            if (quake_data==0 || update % Math.floor(MIN * 60 / intDelay) === 0) {
                const quakeApi = async function () {
                    let quakeQuery = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=NOW-7days&latitude=${latlon.lat}&longitude=${latlon.lon}&maxradius=30&minmagnitude=3.0`);
                    let quakeResp = await quakeQuery.json();
                    let metaData = quakeResp.metadata;
                    let quakeArr = [];
                    if (metaData.count > 0) {
                        //features is an array of reports, even when limit is one
                        //set quakeInfo(state)
                        let quakes = quakeResp.features;
                        //30 miles for 3.0, 300mi for 5.0, and 1000 mi for anything above 7 or alternatively any red flag quakes
                        quakes.forEach(quake => {
                            let props = quake.properties;
                            let mag = props.mag;
                            let coords = quake.geometry.coordinates;
                            //light quakes within 120mi maxradius=2&minmagnitude=3.0&maxmagnitude=4.2
                            if (mag > 3.0 && mag < 4.2) {
                                if (Math.abs(coords[0] - latlon.lon) <= 2 && Math.abs(coords[1] - latlon.lat) <= 2) {
                                    quakeArr.push(props);
                                }
                            }
                            //more sig quakes within 300mi maxradius=5&minmagnitude=4.2&maxmagnitude=5.5
                            else if (mag >= 4.2 && mag < 5.5) {
                                if (Math.abs(coords[0] - latlon.lon) <= 5 && Math.abs(coords[1] - latlon.lat) <= 5) {
                                    quakeArr.push(props);
                                }
                            }
                            //strong quakes withn 600mi maxradius=10&minmagnitude=5.5
                            else if (mag >= 5.5) {
                                if (Math.abs(coords[0] - latlon.lon) <= 10 && Math.abs(coords[1] - latlon.lat) <= 10) {
                                    quakeArr.push(props);
                                }
                            }
                            //large quakes within 1800mi alertlevel=red, your max radius is defined in fetch, not needed here
                            else if (props.alert === 'red') {
                                quakeArr.push(props);
                            }
                        });
                        setQuake_data(quakeArr);
                    }
                }
                quakeApi();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update, isActive]);

    return (
        <div>
            <InfoBar quakeData={quake_data} threeDay={three_day} update={update} />
                <div id="template">
                    <Header />
                    <Report reportHeader={report_data} weatherData={weather_data} currentPosition={latlon} generator={generateReport} refresher={Refresh} />
                    <Alerts zone={weather_zone} />
                </div>
            </div>
    );
}