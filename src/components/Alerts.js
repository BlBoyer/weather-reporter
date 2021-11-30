// JavaScript source code
/*IMPORTANT NOTE:
 * Because useeffect is based on the api call, you don't have to use didMount, 
 * but if the component may update on another effector, component mount must be verified
 */
import { useEffect, useState } from 'react';
//import { zone } from './Report.js';
//we're going to make  a list of reports that we can select to populate the alert paragraph which means we need to show the [0] report if it exists
//if areaAlerts[-1].indexOf() is not 0 setAlert[1]

function Alerts({ zone }) {

    const [alert, setAlert] = useState([]);

    useEffect(() => {
        const api = async function fetchApi() {

            let areaAlerts = ['There are no active alerts in your immediate vicinity.'];
            //let webIndices = [/www\S+/gi, /http\S+/gi];
            if (!zone) {
                console.log("zone isn't set");
            }
            else {
                console.log('zone is set');
                let response = await fetch(`https://api.weather.gov/alerts/active/zone/${zone.slice(-6)}`);
                let data = await response.json();
                if (data.features) {
                    let alerts = data.features;
                    for (let i in alerts) {
                        //if (alerts[i].properties.affectedZones.includes({zone}))
                        let message = alerts[i].properties;
                        areaAlerts.push(message.headline+': '+message.description);
                    }
                }
            }
            setAlert(areaAlerts);
        }
        api();
    }, [zone]);
    //dependency was alert, it should be whichever main function gets the data, in this case the var that we will pass down

    return (
        <footer id="footer"><h2><u>Latest weather alert</u></h2>
            <p>{(alert.length<=1) ? alert.slice(-1) : alert[1]}</p>Last Updated Nov, 2021</footer>
    )
}
export default Alerts;