import { useState, useEffect } from 'react';
import WxWindow from '../components/wx_window.js';
import loading from '../image_files/load_layered.gif';
import rainy from '../image_files/rain.jpg';
import sunny from '../image_files/sunny.jpg';
import stormy from '../image_files/stormy.jpg';
import cloudy from '../image_files/cloudy.jpg';
import snowy from '../image_files/snowy.jpg';

export default function Report({ reportHeader, weatherData, currentPosition, currentLocation, generator, refresher }) {
    //declarations
    const genReport = () => generator;
    const refresh = () => refresher;
    let latlon = currentPosition;
    //these should be set after update
    let dateOfUpdate;
    let dateOfReport;
    if (reportHeader !== 0) {
        dateOfUpdate = new Date(reportHeader.updated).toLocaleString();
        dateOfReport = new Date(weatherData.startTime).toDateString();
    }
    const conditionImages = {
        'rain': rainy,
        'sun': sunny,
        'storm': stormy,
        'cloud': cloudy,
        'snow': snowy,
        'clear': sunny,
        'fog': cloudy
    };
    const [icon, setIcon] = useState({ 'loading': loading });
    let windArr = [];

    //convert mph to knots
    function convertSpeed(){
        if (weatherData.windSpeed) {
            let windNums = weatherData.windSpeed.split(' ').filter((i) => parseInt(i))
            for (let i in windNums) {
                windArr.push(parseFloat(windNums[i] * 0.86897624).toFixed(1));
            }
            return windArr.join(' to ')
        } else {
            windArr = 'Loading...';
            return windArr;
        }
    }
    useEffect(() => {
        if (weatherData.shortForecast) {
            var imgDiv = document.getElementById('template');
            let img_path;
            //Determine Short Forecast Condition
            for (let key in Object.keys(conditionImages)) {
                let word = Object.keys(conditionImages)[key];
                let condition = new RegExp(word, 'ig');
                if (weatherData.shortForecast.match(condition)) {
                    img_path = conditionImages[word]; //whatever the last match is, we could alter later for more specificity
                    let iconOb = {};
                    iconOb[word] = img_path;
                    setIcon(iconOb);
                }
            }
            imgDiv.style.backgroundImage = 'url(' + img_path + ')';
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherData]);

    //pull city into text to give a closest location
    return (
        <div id="report">
            <WxWindow icon={icon} />
            <div id="text-report">
                <div id="report-header"><h2>{weatherData.name}</h2><p>{dateOfReport}</p></div>
            <div><img src={weatherData.icon} alt="Icon provided by weather.gov" align="right" width="50px" height="50px" />
                <b><i>{weatherData.shortForecast}</i></b>
            </div>
                <p><b>Temperature</b>: {weatherData.temperature}&#186; Fahrenheit, {Math.round((weatherData.temperature - 32) / 1.8)}&#186; Celsius<br />
                    <b>Wind</b>: {'' + weatherData.windSpeed + ', ' + convertSpeed() + ' kts '}<b><i>{weatherData.windDirection}</i></b><br />
                    <b>Forecast</b>: {weatherData.detailedForecast} <br /></p>
                    <p>Updated: {dateOfUpdate}</p>
            </div>
            <div id="positioning">
                <p><b>Reporting Position</b>:&nbsp;{latlon.lat + ', ' + latlon.lon}<br/>
                <b>Location</b>:&nbsp;{currentLocation}</p>
                <div>
                    <input type="text" id="coord_input" size="40px" />
                    <button onClick={genReport()}>Get Forecast</button>
                    <button onClick={refresh()}>Refresh Position</button>
                </div>
            </div>
        </div>
    );
}