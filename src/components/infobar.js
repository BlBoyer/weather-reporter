// JavaScript source code
import React, { useState } from 'react';
import { render } from 'react-dom';
export default function InfoBar({ quakeData, threeDay }) {
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
    const [popCount, setPopCount] = useState(1);
    const [buttonText, setButtonText] = useState('Populate');
    let quakesP = "";
    if (quakeData.length > 0) {
        quakeData.forEach(rep => {
            quakesP += `Magnitude ${rep.mag.toString()} quake, ${rep.place.toString()}`
        });
    } else {
        quakesP += "There are no earthquakes of concern for the current position.";
    }
    let rep3 = ["No reports yet."];
    if (threeDay) {
        let repStr = "";
        threeDay.forEach(day => {
            repStr += day.name + '|' + day.temperature +'\xB0'+ day.temperatureUnit + '- ' + day.shortForecast + '|';
        });
        rep3 = repStr.split('|');
    }
    //maybe try a forEach here and put it all inside one p, adding a break after every line, or make seperate string vars
    //if we want to change the paragraphing format
    const renderUpdate = () => {
        setPopCount(popCount => popCount += 1);
        renderQuakes();
        renderThreeDay();
        (popCount % 2 > 0) ? setButtonText('Hide') : setButtonText('Show');
        
    }
    const renderQuakes = () => {
        render(
            (popCount % 2 > 0) ?
                <div>Geological Events
                    <p style={{ marginTop: "2px" }}>{quakesP}</p>
                </div> : <div>Geological Events</div>
            , document.getElementById('quake-div')
        );
    }
    const renderThreeDay = () => {
        render(
            (popCount % 2 > 0) ?
                <div>Next Three Days<br />{
                    rep3.map(
                        (rep, index) =>
                            (index % 2 === 0) ? <p key={index}><b>{rep}</b></p> : <p key={index}>{rep}</p>
                    )
                }</div> : <div>Next Three Days</div>
            , document.getElementById('three-day')
        );
    }

    return (
        <div id="info-bar">
            <div id="quake-div">Geological Events</div>
            <div id="three-day">Next Three Days</div>
            <button onClick={renderUpdate}>{buttonText}</button>
        </div>
    );
}