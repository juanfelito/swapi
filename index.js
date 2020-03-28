const http = require('http')
const RunAPI = require('./runAPI')
const port = '4200'

const server = http.createServer(async (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    response = await RunAPI()
    res.end(JSON.stringify(response))
})

server.listen(port, 'localhost', () => {
    console.log(`Server running at http://localhost:${port}/`)
})