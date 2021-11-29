// JavaScript source code
    /* API functions
     *    let data = await response.json(); //parses json object*/
   /* fetch(api)
        .then(response => { 'handle' })
        .catch(error => { 'error' });
        */
   /* Forecasts are divided into 2.5km grids.Each NWS office is responsible for a section of the grid.The API endpoint for the forecast at a specific grid is:

    https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast
    For example: https://api.weather.gov/gridpoints/TOP/31,80/forecast

    If you do not know the grid that correlates to your location, you can use the / points endpoint to retrieve the exact grid endpoint by coordinates:

    https://api.weather.gov/points/{latitude},{longitude}
    For example: https://api.weather.gov/points/39.7456,-97.0892

    This will return the grid endpoint in the "forecast" property.Applications may cache the grid for a location to improve latency and reduce the additional lookup request.This endpoint also tells the application where to find information for issuing office, observation stations, and zones.

    How do I get alerts ?
        The API has a robust selection of filters for alerts.A common request is all active alerts for a state:

            https://api.weather.gov/alerts/active?area={state}
            For example: https://api.weather.gov/alerts/active?area=KS
            'https://api.weather.gov/alerts/active/zone/WAZ504'
            */
/*IMPORTANT NOTE:
 * Because useeffect is based on the api call, you don't have to use didMount, but if the component may update on another effector, component mount must be verified
 */
import { useEffect, useState } from 'react';
//import { zone } from './Report.js';
//we're going to make  a list of reports that we can select to populate the alert paragraph which means we need to show the [0] report if it exists
//if areaAlerts[-1].indexOf() is not 0 setAlert[1]

function Alerts({ zone }) {

    const [alert, setAlert] = useState([]);

    useEffect(() => {
        const api = async function fetchApi() {
            //we will change this fetch to our area passed in from points, we can just get alerts from zone if we want
            //NOTE: if href replace method in alert text
//            let response = await fetch('https://api.weather.gov/alerts/active?area=WA');
            let areaAlerts = ['There are no active alerts in your immediate vicinity.'];
            let webIndices = [/www\S+/gi, /http\S+/gi];
            if (zone) {
                let response = await fetch(`https://api.weather.gov/alerts/active/zone/${zone.slice(-6)}`);
                let data = await response.json();
                if (data.features) {
                    let alerts = data.features;
                    for (let i in alerts) {
                        //if (alerts[i].properties.affectedZones.includes({zone}))
                        let message = alerts[i].properties.description;
                        for (let ind in webIndices) {
                            let webInd=webIndices[ind];
                            message.replaceAll(webInd, <a>{webInd}</a>)
                        }
                        areaAlerts.push(message);
                    }
                }
                setAlert(areaAlerts);
            }
    }
        api();
    }, [zone]); //dependency was alert, it should be whichever main function gets the data, in this case the var that we will pass down

    return (
        //?loading <img src={icon} className='loading'></> put under h2
        <footer id="footer"><h2><u>Latest weather alert</u></h2>
            <p>{(alert.length<=1) ? alert.slice(-1) : alert[1]}</p>@Updated 2021</footer>
    )
}
export default Alerts;