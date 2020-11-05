const request = require('request')
const cheerio = require('cheerio')

// Global constants
const durationMin = 10
const radiationThreshold = 120

// Global variables
const precipitationHistory = []
const sunshineHistory = []
const radiationHistory = []
const windDirectionHistory = []
const windSpeedHistory = []
const gustPeakHistory = []

/**
 * Update the history of precipitation.
 * @param {number} precipitationHourly The current precipitation value of this hour.
 */
function updatePrecipitationHistory (precipitationHourly) {

    const precipitationThreshold = Date.now() - (durationMin * 60 * 1000)
    while (precipitationHistory.length > 0 && precipitationThreshold > precipitationHistory[0].ts) {
        precipitationHistory.shift()
    }

    if (!isNaN(precipitationHourly)) {
        precipitationHistory.push({ ts: Date.now(), value: precipitationHourly })
    }
}

/**
 * Update the history of sunshine.
 * @param {number} radiation The current radiation value.
 */
function updateSunshineHistory (radiation) {

    const sunshineThreshold = Date.now() - (durationMin * 60 * 1000)
    while (sunshineHistory.length > 0 && sunshineThreshold > sunshineHistory[0].ts) {
        sunshineHistory.shift()
    }

    if (!isNaN(radiation)) {
        sunshineHistory.push({ ts: Date.now(), value: radiation > radiationThreshold })
    }
}

/**
 * Update the history of radiation.
 * @param {number} radiation The current radiation value.
 */
function updateRadiationHistory (radiation) {

    const radiationThreshold = Date.now() - (durationMin * 60 * 1000)
    while (radiationHistory.length > 0 && radiationThreshold > radiationHistory[0].ts) {
        radiationHistory.shift()
    }

    if (!isNaN(radiation)) {
        radiationHistory.push({ ts: Date.now(), value: radiation })
    }
}

/**
 * Update the history of wind direction.
 * @param {number} windDirection The current wind direction value.
 */
function updateWindDirectionHistory (windDirection) {

    const windDirectionThreshold = Date.now() - (durationMin * 60 * 1000)
    while (windDirectionHistory.length > 0 && windDirectionThreshold > windDirectionHistory[0].ts) {
        windDirectionHistory.shift()
    }

    if (!isNaN(windDirection)) {
        windDirectionHistory.push({ ts: Date.now(), value: windDirection })
    }
}

/**
 * Update the history of wind speed.
 * @param {number} windSpeed The current wind speed value.
 */
function updateWindSpeedHistory (windSpeed) {

    const windSpeedThreshold = Date.now() - (durationMin * 60 * 1000)
    while (windSpeedHistory.length > 0 && windSpeedThreshold > windSpeedHistory[0].ts) {
        windSpeedHistory.shift()
    }

    if (!isNaN(windSpeed)) {
        windSpeedHistory.push({ ts: Date.now(), value: windSpeed })
    }
}

/**
 * Update the history of gust peak.
 * @param {number} gustPeak The current gust peak value.
 */
function updateGustPeakHistory (gustPeak) {

    var gustPeakThreshold = Date.now() - (durationMin * 60 * 1000)
    while (gustPeakHistory.length > 0 && gustPeakThreshold > gustPeakHistory[0].ts) {
        gustPeakHistory.shift()
    }

    if (!isNaN(gustPeak)) {
        gustPeakHistory.push({ ts: Date.now(), value: gustPeak })
    }
}

/**
 * Calculate the precipitation sum of the current precipitation history.
 */
function calculatePrecipitationSum () {

    // Default precipitation value
    let precipitationSum = 0

    // Go through all history entries and sum up the difference
    for (var i = 1; i < precipitationHistory.length; i++) {
        var precipitationDiff = precipitationHistory[i].value - precipitationHistory[i - 1].value
        if (precipitationDiff < 0) {
            precipitationDiff = precipitationHistory[i].value
        }
        precipitationSum += precipitationDiff
    }

    return precipitationSum
}

/**
 * Calculate the current precipitation value.
 */
function calculatePrecipitationCurrent () {

    let precipitationCurrent = 0

    // If we have two or more history entries, get the positive diff from the
    // last two entries as the current precipitation
    if (precipitationHistory.length >= 2) {
        precipitationCurrent = precipitationHistory[precipitationHistory.length - 1].value - precipitationHistory[precipitationHistory.length - 2].value
        if (precipitationCurrent < 0) {
            precipitationCurrent = 0
        }
    }

    return precipitationCurrent
}

/**
 * Calculate the sunshine duration during the specified last minutes.
 */
function calculateSunshineSum () {

    let sunshine = 0

    // If we have a history, go through all history entries and sum up the
    // sunshine moments
    if (sunshineHistory.length > 0) {
        for (var i = 0; i < sunshineHistory.length; i++) {
            if (sunshineHistory[i].value) {
                sunshine++
            }
        }

        sunshine = Math.round(sunshine / sunshineHistory.length * durationMin)
    }

    return sunshine
}

/**
 * Calculate the average radiation during the specified last minutes.
 */
function calculateRadiationAvg () {

    let radiation = 0

    // If we have a history, go through all history entries and calculate the
    // average radiation
    if (radiationHistory.length > 0) {
        for (var i = 0; i < radiationHistory.length; i++) {
            radiation += radiationHistory[i].value
        }

        radiation = Math.round(radiation / radiationHistory.length)
    }

    return radiation
}

/**
 * Calculate the average wind direction during the specified last minutes.
 */
function calculateWindDirectionAvg () {

    let windDirection = 0

    // If we have a history, go through all history entries and calculate the
    // average wind direction
    if (windDirectionHistory.length > 0) {
        for (var i = 0; i < windDirectionHistory.length; i++) {
            windDirection += windDirectionHistory[i].value
        }

        windDirection = Math.round(windDirection / windDirectionHistory.length)
    }

    return windDirection
}

/**
 * Calculate the average wind speed during the specified last minutes.
 */
function calculateWindSpeedAvg () {

    let windSpeed = 0

    // If we have a history, go through all history entries and calculate the
    // average wind speed
    if (windSpeedHistory.length > 0) {
        for (var i = 0; i < windSpeedHistory.length; i++) {
            windSpeed += windSpeedHistory[i].value
        }

        windSpeed = Math.round(windSpeed / windSpeedHistory.length)
    }

    return windSpeed
}

/**
 * Calculate the average gust peak during the specified last minutes.
 */
function calculateGustPeakHistoryMax () {

    let gustPeak = 0

    // If we have a history, go through all history entries and get the maximum
    // gust peak
    if (gustPeakHistory.length > 0) {
        for (var i = 0; i < gustPeakHistory.length; i++) {
            if (gustPeakHistory[i].value > gustPeak) {
                gustPeak = gustPeakHistory[i].value
            }
        }
    }

    return gustPeak
}

/**
 * Get the WH2600 weather data.
 * @param {string}                   address  IP address of the weather station.
 * @param {function(string, string)} callback Callback with the response object.
 */
function getWeatherData (address, callback) {

    // Define the static url to the WH2600 website
    const url = 'http://' + address + '/livedata.htm'

    request.get(url, (error, response, body) => {
        if (error) {
            callback(error, null)
        } else if (response.statusCode !== 200) {
            callback(new Error('Request failed with http status code ' + response.statusCode), null)
        } else {
            const $ = cheerio.load(body)

            const rawRainOfHourly = Number($('input[name="rainofhourly"]').val())
            const rawSolarRad = Number($('input[name="solarrad"]').val())
            const rawWinDir = Number($('input[name="avgwind"]').val())
            const rawWindSpeed = Number($('input[name="windspeed"]').val())
            const rawGustSpeed = Number($('input[name="gustspeed"]').val())

            updatePrecipitationHistory(rawRainOfHourly)
            updateSunshineHistory(rawSolarRad)
            updateRadiationHistory(rawSolarRad)
            updateWindDirectionHistory(rawWinDir)
            updateWindSpeedHistory(rawWindSpeed)
            updateGustPeakHistory(rawGustSpeed)

            var weatherData = {
                indoorSensorId: $('input[name="IndoorID"]').val(),
                indoorSensorBatteryStatus: $('input[name="inBattSta"]').val(),
                outdoorSensor1Id: $('input[name="Outdoor1ID"]').val(),
                outdoorSensor1BatteryStatus: $('input[name="outBattSta1"]').val(),
                outdoorSensor2Id: $('input[name="Outdoor2ID"]').val(),
                outdoorSensor2BatteryStatus: $('input[name="outBattSta2"]').val(),
                temperature: Number($('input[name="outTemp"]').val()),
                precipitation: calculatePrecipitationCurrent(),
                precipitation10Min: calculatePrecipitationSum(),
                precipitationHourly: rawRainOfHourly,
                precipitationDaily: Number($('input[name="rainofdaily"]').val()),
                precipitationWeekly: Number($('input[name="rainofweekly"]').val()),
                precipitationMonthly: Number($('input[name="rainofmonthly"]').val()),
                precipitationYearly: Number($('input[name="rainofyearly"]').val()),
                sunshine: rawSolarRad > radiationThreshold,
                sunshine10Min: calculateSunshineSum(),
                radiation: rawSolarRad,
                radiation10Min: calculateRadiationAvg(),
                humidity: Number($('input[name="outHumi"]').val()),
                windDirection: rawWinDir,
                windDirection10Min: calculateWindDirectionAvg(),
                windSpeed: rawWindSpeed,
                windSpeed10Min: calculateWindSpeedAvg(),
                gustPeak: rawGustSpeed,
                gustPeak10Min: calculateGustPeakHistoryMax(),
                pressureAbsolute: Number($('input[name="AbsPress"]').val()),
                pressureRelative: Number($('input[name="RelPress"]').val()),
                uv: Number($('input[name="uv"]').val()),
                uvIndex: Number($('input[name="uvi"]').val())
            }

            for (const property of Object.keys(weatherData)) {
                if (weatherData[property] === '0x--' ||
                    weatherData[property] === '- -' ||
                    weatherData[property] === '--.-' ||
                    weatherData[property] === '--' ||
                    weatherData[property] === '----') {
                    weatherData[property] = undefined
                }
            }

            callback(null, weatherData)
        }
    })
}

// Node.JS module function export
module.exports.getWeatherData = getWeatherData
