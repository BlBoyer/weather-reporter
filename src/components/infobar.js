// JavaScript source code
import React, { useState } from 'react';
import { render } from 'react-dom';
export default function InfoBar({ quakeData, threeDay }) {
  const [popCount, setPopCount] = useState(1);
  const [buttonText, setButtonText] = useState('Populate');
  //let quakesP = "";
  let quakeArr = ['There are no earthquakes of concern for the current position.'];

  if (quakeData.length > 0) {
    quakeData.forEach(rep => {
      quakeArr.push(` ${new Date(rep.time).toLocaleString()}- Magnitude ${rep.mag} earthquake, ${rep.place}`);
    });
  }

  let rep3 = ['No reports yet.'];
  if (threeDay) {
    let repStr = '';
    threeDay.forEach(day => {
      repStr += `${day.name} | ${day.temperature}\xB0${day.temperatureUnit} - ${day.shortForecast} |`;
    });
    rep3 = repStr.split('|').slice(0, -1);
  }

  const renderUpdate = () => {
    setPopCount(popCount => (popCount += 1));
    renderQuakes();
    renderThreeDay();
    popCount % 2 > 0 ? setButtonText('Hide') : setButtonText('Show');
  };

  const renderQuakes = () => {
    render(
      popCount % 2 > 0 ? (
        <div>
          Geological Events
          <div style={{ marginTop: '2px' }}>
            {quakeArr.slice(1).map((ev, index) => (
              <p key={index}>{ev}</p>
            ))}
          </div>
        </div>
      ) : (
        <div>Geological Events</div>
      ),
      document.getElementById('quake-div')
    );
  };

  const renderThreeDay = () => {
    render(
      popCount % 2 > 0 ? (
        <div>
          Next Three Days
          <br />
          {rep3.map((rep, index) =>
            index % 2 === 0 ? (
              <p key={index}>
                <b>{rep}</b>
              </p>
            ) : (
              <p key={index}>{rep}</p>
            )
          )}
        </div>
      ) : (
        <div>Next Three Days</div>
      ),
      document.getElementById('three-day')
    );
  };

  return (
    <div id='info-bar'>
      <div id='quake-div' className='px-sm'>
        Geological Events
      </div>
      <div id='three-day' className='px-sm'>
        Next Three Days
      </div>
      <button onClick={renderUpdate}>{buttonText}</button>
    </div>
  );
}
