import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar.js';
import loading from '../image_files/loading.gif';
import rainy from '../image_files/rain.jpg';
import sunny from '../image_files/sunny.jpg';
import stormy from '../image_files/stormy.jpg';
import cloudy from '../image_files/cloudy.jpg';
import snowy from '../image_files/snowy.jpg';

export default function Report({ weatherData, currentPosition, generator }) {
    //change weather data based on onClick from get report
    //declarations
    const genReport = () => generator;
    let latlon = currentPosition;
    const conditionImages = {
        'rain': rainy,
        'sun': sunny,
        'storm': stormy,
        'cloud': cloudy,
        'snow': snowy
    };
    const [icon, setIcon] = useState({ 'loading': loading });
    let windArr = [];

    /*Find all complete numbers in windSpeed string, or just map/reduce the string where index is Nan
     * let knotWind = weather_data.windSpeed.slice(0, 1) * 0.86897624.toPrecision(1)
       let windNums= weather_data.windSpeed.reduce((i)=>typeof(i)==number)
       let windNums = weather_data.windSpeed.split(' ').filter((i) => parseInt(i)).join(' to ');
    */
    //THIS NEEDS TO RENDER AN ELEMENT WITH THE INFO REQUESTED INSTEAD, NOT USED AS A VALUE --but it still works

    function convertSpeed(){
        if (weatherData.windSpeed) {
            let windNums = weatherData.windSpeed.split(' ').filter((i) => parseInt(i))
            for (let i in windNums) {
                windArr.push(windNums[i] * 0.86897624.toPrecision(1));
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
            //keyWord = weather_data.shortForecast.split(' ').filter((i) => conditions.includes(i.toLowerCase()));
            //Determine Short Forecast Condition
            for (let key in Object.keys(conditionImages)) {
                let word = Object.keys(conditionImages)[key];
                let condition = new RegExp(word, 'ig');
                if (weatherData.shortForecast.match(condition)) {
                    img_path = conditionImages[word]; //whatever the last match is
                    let iconOb = {};
                    iconOb[word] = img_path;
                    setIcon(iconOb);
                }
            }
            imgDiv.style.backgroundImage = 'url(' + img_path + ')';
            //we cant setIcon to a condition images name and path value here, then pass to sidebar props reducing the extra function
            //setIcon(img_path);
        }
    }, [weatherData]);
    //{()=>generator(document.getElementById("coord_input").value)}
    //pull city into text to give a closest location
    return (
        <div id="report">
            <Sidebar icon={icon} />
            <div id="text-report">
                <div><h2>{weatherData.name}</h2><img src={weatherData.icon} alt="Icon provided by weather.gov" align="right" width="50px" height="50px" /></div>
                <b><i>{weatherData.shortForecast}</i></b>
                <p><b>Temperature</b>: {weatherData.temperature}&#186; Fahrenheit, {Math.round((weatherData.temperature - 32) / 1.8)}&#186; Celsius<br />
                    <b>Wind</b>: {'' + weatherData.windSpeed + ', ' + convertSpeed() + ' kts '}<b>{weatherData.windDirection}</b><br />
                <b>Forecast</b>: {weatherData.detailedForecast}<br /><br /></p>
            </div>
            <div>
                <p><b>Current position</b>:{' ' + latlon.lat + ', ' + latlon.lon}</p>
                <input type="text" id="coord_input" size="40px" /><button onClick={genReport()}>Get Forecast</button>
            </div>
        </div>
    );
}
/**/