/*
 * info wanted:
 * metadata
 *  .generated
 *  .status
 *  .count
 * features[item]
 * .properties
 *      .mag /float
 *      .place /string
 *      .time /ms number
 *      .updated /ms number
 *      .felt /number of ppl
 *      .alert /null, green, yellow, orange, red
 *      .type /string, ?earthquake, tsunami, eruption
 *      .tsunami /number intensity? 0
 * .geometry
 *      .coordinates
*/

javascript({
    "type": "FeatureCollection",
    "metadata": {
        "generated": 1640399287000,
        "url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&callback=javascript&latitude=46.834&longitude=-122.534&maxradius=4&minmagnitude=3.0",
        "title": "USGS Earthquakes",
        "status": 200,
        "api": "1.12.3",
        "count": 2
    },
    "features": [{
        "type": "Feature",
        "properties": {
            "mag": 3.6,
            "place": "12 km ENE of Ganges, Canada",
            "time": 1639743231663,
            "updated": 1640140314374,
            "tz": null,
            "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us6000gd2p",
            "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us6000gd2p&format=geojson",
            "felt": 1010,
            "cdi": 4.2,
            "mmi": 3.43,
            "alert": null,
            "status": "reviewed",
            "tsunami": 0,
            "sig": 619,
            "net": "us",
            "code": "6000gd2p",
            "ids": ",uw61806621,us6000gd2p,",
            "sources": ",uw,us,",
            "types": ",dyfi,moment-tensor,origin,phase-data,shakemap,",
            "nst": null,
            "dmin": 0.117,
            "rms": 0.74,
            "gap": 54,
            "magType": "ml",
            "type": "earthquake",
            "title": "M 3.6 - 12 km ENE of Ganges, Canada"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-123.35, 48.8993, 17.29]
        },
        "id": "us6000gd2p"
    },
        {
            "type": "Feature",
            "properties": {
                "mag": 3.14,
                "place": "24 km N of Winthrop, Washington",
                "time": 1638739261570,
                "updated": 1639127855366,
                "tz": null,
                "url": "https://earthquake.usgs.gov/earthquakes/eventpage/uw61803056",
                "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=uw61803056&format=geojson",
                "felt": 32,
                "cdi": 3.1,
                "mmi": 3.11,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 162,
                "net": "uw",
                "code": "61803056",
                "ids": ",uw61803056,us6000g9by,",
                "sources": ",uw,us,",
                "types": ",dyfi,origin,phase-data,shakemap,",
                "nst": 27,
                "dmin": 0.25,
                "rms": 0.27,
                "gap": 87,
                "magType": "ml",
                "type": "earthquake",
                "title": "M 3.1 - 24 km N of Winthrop, Washington"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-120.236166666667, 48.6986666666667, 9.6]
            },
            "id": "uw61803056"
        }],
    "bbox": [-123.35, 48.698666666667, 9.6, -120.23616666667, 48.8993, 17.29]
});