// JavaScript source code
import React from 'react';
export default function InfoBar() {
    var returnList = ['Geological events', 'Hazard-levels', 'Next 3 days']; //get api info for textFields
    var listMapper = returnList.map((dat) => <p>{dat}</p>);
    return (
        <div id="info-bar">
            <div>{listMapper}</div>
            <button>Populate</button>
        </div>
    );
}