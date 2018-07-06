const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

const LocationType = new GraphQLObjectType({
    name: 'Location',
    description: 'Location',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: location => location.name[0]
        },
        type: {
            type: GraphQLString,
            resolve: location => location.type[0]
        },
        country: {
            type: GraphQLString,
            resolve: location => location.country[0]
        },
        altitude: {
            type: GraphQLFloat,
            resolve: ({ location }) => location[0].$.altitude
        },
        latitude: {
            type: GraphQLFloat,
            resolve: ({ location }) => location[0].$.latitude
        },
        longitude: {
            type: GraphQLFloat,
            resolve: ({ location }) => location[0].$.longitude
        }
    })
})

const WindType = new GraphQLObjectType({
    name: 'WindSpeed',
    description: 'WindSpeed',
    fields: () => ({
        speed_mps: {
            type: GraphQLFloat,
            resolve: ({windSpeed}) => windSpeed[0].$.mps
        },
        speed: {
            type: GraphQLString,
            resolve: ({windSpeed}) => windSpeed[0].$.name
        },
        direction: {
            type: GraphQLString,
            resolve: ({windDirection}) => windDirection[0].$.name
        },
        direction_deg: {
            type: GraphQLString,
            resolve: ({windDirection}) => windDirection[0].$.deg
        }
    })

})

const SymbolType = new GraphQLObjectType({
    name: 'Symbol',
    description: 'Symbol',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: symbol => symbol.$.name
        },
        icon: {
            type: GraphQLString,
            resolve: symbol => `https://www.yr.no/grafikk/sym/v2016/png/100/${symbol.$.var}.png` 
        }
    })
})

const TimeType = new GraphQLObjectType({
    name: 'Time',
    description: 'Time',
    fields: () => ({
        from: {
            type: GraphQLString,
            resolve: time => time.$.from
        },
        to: {
            type: GraphQLString,
            resolve: time => time.$.to
        },
        wind: {
            type: WindType,
            resolve: time => time
        },
        symbol: {
            type: SymbolType,
            resolve: time => time.symbol[0]
        },
        temperature: {
            type: GraphQLInt,
            resolve: time => time.temperature[0].$.value
        },
    })
})

const ForecastType = new GraphQLObjectType({
    name: 'Forecast',
    description: 'Forecast',
    fields: () => ({
        times: {
            type: GraphQLList(TimeType),
            args: {
                from: {
                    type: GraphQLString
                }
            },
            resolve: (forecast, {from}) => {
                const fromDate = from && new Date(from);

                return from ? forecast.tabular[0].time.filter(time => {
                    const timeFrom = new Date(time.$.from)
                    return fromDate > timeFrom;
                }) : forecast.tabular[0].time;
            }
        }
    })
})

const WeatherType = new GraphQLObjectType({
    name: 'Weather',
    description: 'Weather',
    fields: () => ({
        location: {
            type: LocationType,
            resolve: weatherdata => weatherdata.location[0]
        },
        forecast: {
            type: ForecastType,
            resolve: weatherdata => weatherdata.forecast[0]
        }
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'WeatherForecast',
        description: 'WeatherForecast',
        fields: () => ({
            weather: {
                type: WeatherType,
                args: {
                    country: { type: GraphQLNonNull(GraphQLString) },
                    city: { type: GraphQLNonNull(GraphQLString) },
                    region: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context) => context.weatherLoader.load(args)
            }
        })
    })
})