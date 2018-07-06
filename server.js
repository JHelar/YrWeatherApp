const express = require('express')
const graphqlHTTP = require('express-graphql')
const app = express()
const graphqlSettings = require('./graphql-settings');


app.use('/weather', graphqlHTTP(graphqlSettings))
app.listen(process.env.SERVER_PORT, () => console.log(`Listening on port ${process.env.SERVER_PORT}`));