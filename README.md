# mqtt2wh2600

[![mqtt-smarthome](https://img.shields.io/badge/mqtt-smarthome-blue.svg?style=flat-square)](https://github.com/mqtt-smarthome/mqtt-smarthome)
[![npm](https://img.shields.io/npm/v/mqtt2wg2600.svg?style=flat-square)](https://www.npmjs.com/package/mqtt2wg2600)
[![travis](https://img.shields.io/travis/claudiospizzi/mqtt2wg2600.svg?style=flat-square)](https://travis-ci.org/claudiospizzi/mqtt2wg2600)

This node.js application is a bridge between the WH2600 weather station and a
mqtt broker. The weather station is distributed under different names: FOSHK
WH2600, Froggit WH2600 / WH2601 / WH2600 SE, Conrad Renkforce WH2600 and Ambient
Weather WS-1400. The bridge can publish the latest weather data from the weather
station to the target mqtt broker. The source data is updated every 16 seconds.

## Installation

This node.js application is installed from the npm repository and executed with
the node command. It will load the default configuration file *config.json*.

```bash
npm install -g mqtt2wg2600
node /usr/local/bin/mqtt2wg2600
```

Alternatively, the module can be executed as a docker container. Use the
following Dockerfile to build a container by injecting the config file.

```dockerfile
FROM node:alpine

RUN npm install -g mqtt2wg2600

COPY config.json /etc/mqtt2wg2600.json

ENTRYPOINT [ "/usr/local/bin/mqtt2wg2600", "/etc/mqtt2wg2600.json" ]
```

## Configuration

The following configuration file is an example. Please replace the desired
values like the mqtt url and add the ip address of the weather station.

```json
{
    "log": "debug",
    "mqtt": {
        "url": "mqtt://192.168.1.10",
        "name": "wh2600",
        "secure": false
    },
    "wh2600": {
        "pollIntervalSec": 16,
        "name": "My Station",
        "address": "192.168.1.20"
    }
}
```

## Topics

### Publish (status messages)

Every 16 seconds, the da    ta from the WH2600 weather stations is updated. All
values will be published to the MQTT in dedicated topics. The following topics
are be published for the station *My Station*. The latest value is in the JSON
payload field `val`,

* `indoorSensorId`  
  Id of the indoor sensor.
* `indoorSensorBatteryStatus`  
  Current battery status of the indoor sensor.
* `outdoorSensor1Id`  
  Id of the outdoor sensor 1.
* `outdoorSensor1BatteryStatus`  
  Current battery status of the outdoor sensor 1.
* `outdoorSensor2Id`  
  Id of the outdoor sensor. 2
* `outdoorSensor2BatteryStatus`  
  Current battery status of the outdoor sensor 2.
* `wh2600/temperature/My Station`  
  Current air temperature in `°C`.
* `wh2600/precipitation/My Station`  
  Current precipitation in `mm`.
* `wh2600/precipitation10Min/My Station`  
  Total precipitation during the last ten minutes in `mm`.
* `wh2600/precipitationHourly/My Station`  
  Total precipitation during the last hour in `mm`.
* `wh2600/precipitationDaily/My Station`  
  Total precipitation during the last day in `mm`.
* `wh2600/precipitationWeekly/My Station`  
  Total precipitation during the last week in `mm`.
* `wh2600/precipitationMonthly/My Station`  
  Total precipitation during the last month in `mm`.
* `wh2600/precipitationYearly/My Station`  
  Total precipitation during the last year in `mm`.
* `wh2600/sunshine/My Station`  
  Current sunshine as `bool`.
* `wh2600/sunshine10Min/My Station`  
  Total sunshine duration during the last ten minutes in `min`.
* `wh2600/radiation/My Station`  
  Current radiation in `W/m²`.
* `wh2600/radiation10Min/My Station`  
  Mean radiation during the last ten minutes in `W/m²`.
* `wh2600/humidity/My Station`  
  Current relative air humidity in `%`.
* `wh2600/windDirection/My Station`  
  Current wind direction in `°`.
* `wh2600/windDirection10Min/My Station`  
  Mean wind direction during the last ten minutes in `°`.
* `wh2600/windSpeed/My Station`  
  Current wind speed in `km/h`.
* `wh2600/windSpeed10Min/My Station`  
  Mean wind speed during the last ten minutes in `km/h`.
* `wh2600/gustPeak/My Station`  
  Current maximum gust peak in `km/h`.
* `wh2600/gustPeak10Min/My Station`  
  Maximum gust peak during the last ten minutes in `km/h`.
* `wh2600/pressureAbsolute/My Station`  
  Current pressure at station level (QFE) in `hPa`.
* `wh2600/pressureRelative/My Station`  
  Current pressure at sea level (QFF) in `hPa`.

## Station Settings

Ensure the following stations settings are set:

* Wind: `km/h`
* Rainfall: `mm`
* Pressure: `hpa`
* Temperature: `degC`
* Solar Radiation: `w/m2`
