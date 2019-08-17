#!/usr/bin/env node

/**
 * SETUP
 */

// Global modules
const log = require('yalm')
const mqtt = require('mqtt')

// Local modules
const wh2600 = require('./modules/wh2600.js')

const pkg = require('./package.json')
const cfg = require(process.argv[2] || './config.json')

log.setLevel(cfg.log)
log.info(pkg.name + ' ' + pkg.version + ' starting')

/**
 * SETUP MQTT
 */

let mqttConnected

const mqttClient = mqtt.connect(
    cfg.mqtt.url, {
        will: { topic: cfg.mqtt.name + '/connected', payload: '0', retain: true },
        rejectUnauthorized: cfg.mqtt.secure
    }
)

mqttClient.on('connect', () => {
    mqttClient.publish(cfg.mqtt.name + '/connected', '2', { retain: true })
    log.info('mqtt: connected ' + cfg.mqtt.url)
    mqttConnected = true
})

mqttClient.on('close', () => {
    if (mqttConnected) {
        log.info('mqtt: disconnected ' + cfg.mqtt.url)
        mqttConnected = false
    }
})

mqttClient.on('error', err => {
    log.error('mqtt: error ' + err.message)
})

/**
 * POLLING LOGIC
 */

function pollWeatherStationData () {
    wh2600.getWeatherData(cfg.wh2600.address, (error, response) => {
        if (error) {
            log.error(error)
        } else {
            log.debug('wh2600 weather data: ' + JSON.stringify(response))
            for (const property of Object.keys(response)) {
                if (response[property] !== undefined) { 
                    const payload = JSON.stringify({ val: response[property], ts: Date.now() })
                    mqttClient.publish(cfg.mqtt.name + '/' + property + '/' + cfg.wh2600.name, payload)
                    log.info('mqtt: publish ' + cfg.mqtt.name + '/' + property + '/' + cfg.wh2600.name + ' ' + payload)
                }
            }
        }
    })
}

pollWeatherStationData()
setInterval(pollWeatherStationData, cfg.wh2600.pollIntervalSec * 1000)
