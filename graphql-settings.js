const DataLoader = require('dataloader')
const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const schema = require('./schema')

const fetchWeather = ({country, city, region}) => fetch(`http://www.yr.no/place/${country}/${city}/${region}/forecast.xml`)
.then(response => response.text())
.then(parseXML)
.then(xml => xml.weatherdata)
.catch(console.log)

const weatherLoader = new DataLoader(keys => Promise.all(keys.map(fetchWeather)))

module.exports = {
    schema,
    context: {
        weatherLoader
    },
    graphiql: false
}