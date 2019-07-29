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
        "name": "swissmeteo",
        "secure": false
    },
    "wh2600": {
        "pollInterval": 16,
        "address": "192.168.1.20"
    }
}
```

## Topics

### Publish (status messages)

tbd
