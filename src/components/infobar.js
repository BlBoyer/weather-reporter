// JavaScript source code
import React, { useState } from 'react';
import { render } from 'react-dom';
export default function InfoBar({ quakeData, threeDay }) {
    //make populate function here using imported data from data_grabber
    //make variables in grabber: quake_data, three_day, amb_levels
    /*"mag": 3.6,
      "place": "12 km ENE of Ganges, Canada",
      "time": 1639743231663,
      "felt": 1010,
      "alert": null,
      "tsunami": 0,*/
    const [popCount, setPopCount] = useState(1);
    const [buttonText, setButtonText] = useState('Populate');
    //let quakesP = "";
    let quakeArr = ["There are no earthquakes of concern for the current position."];
    if (quakeData.length > 0) {
        quakeData.forEach(rep => {
            //quakesP += `Magnitude ${rep.mag} quake, ${rep.place}, ${new Date(rep.time).toLocaleString()} | `;
            quakeArr.push(` ${new Date(rep.time).toLocaleString()}- Magnitude ${rep.mag} earthquake, ${rep.place}`);
        });
    } /*else {
        quakesP += "There are no earthquakes of concern for the current position.";
    }*/
    let rep3 = ["No reports yet."];
    if (threeDay) {
        let repStr = "";
        threeDay.forEach(day => {
            repStr += day.name + '|' + day.temperature +'\xB0'+ day.temperatureUnit + ' -' + day.shortForecast + '|';
        });
        rep3 = repStr.split('|').slice(0,-1);
    }
    //maybe try a forEach here and put it all inside one p, adding a break after every line, or make seperate string vars
    //if we want to change the paragraphing format
    //call to render subcomponents, we could use variables or button switchest to control what updates if desired
    const renderUpdate = () => {
        setPopCount(popCount => popCount += 1);                                 //state toggle
        renderQuakes();                                                         //render function 'a'
        renderThreeDay();                                                       //render function 'b'
        (popCount % 2 > 0) ? setButtonText('Hide') : setButtonText('Show');     //controller update
        
    }
    //we could possibly place subcomponents in their respective div using <subCompName /> and then remove the render positions
    const renderQuakes = () => {
        render(
            (popCount % 2 > 0) ?
                <div>Geological Events
                    <div style={{ marginTop: "2px" }}>{quakeArr.slice(1,).map(
                        (ev, index) =>
                            <p key={index}>{ev}</p>
                    )}</div>
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
    //the infobar div with placeholders
    return (
        <div id="info-bar">
            <div id="quake-div" className='px-sm'>Geological Events</div>
            <div id="three-day" className='px-sm' >Next Three Days</div>
            <button onClick={renderUpdate}>{buttonText}</button>
        </div>
    );
}