// JavaScript source code
import React from 'react';
export default function InfoBar({ quakeData }) {
    //make populate function here using imported data from data_grabber
    //make variables in grabber: quake_data, three_day, amb_levels
    //<p>{quakeData[0].place.toString()}</p>
    //render quake info under 1st p child of the comp
    /*"mag": 3.6,
      "place": "12 km ENE of Ganges, Canada",
      "time": 1639743231663,
      "felt": 1010,
      "alert": null,
      "tsunami": 0,*/
    let quakesP = "";
    if (quakeData.length > 0) {
        quakeData.forEach(rep => {
            quakesP += `Magnitude ${rep.mag.toString()} quake, ${rep.place.toString()}`
        });
    } else {
        quakesP += "There are no earthquakes of concern for the current position.";
    }
    return (
        <div id="info-bar">
            <div>Geological Events
                <p>{quakesP}</p>
            </div>
            <div>Next Three Days</div>
            <button>Populate</button>
        </div>
    );
}