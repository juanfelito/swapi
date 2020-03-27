const https = require('https')

const RunAPI = async () => {
    const apiData = await RequestData('https://swapi.co/api/films/')

    if (apiData.count && apiData.count > 0) {
        apiData.results.forEach(movie => {
            PrintMovieInformation(movie)
        })
    } else {
        console.log("There was an error or there are zero movies available")
    }
}

const RequestData = (url) => {
    return new Promise((resolve, reject) => {
        let data = ''
        https.get(url, (response) => {
            response.on('data', (chunk) => {
                data += chunk
            })

            response.on('end', () => {
                resolve(JSON.parse(data))
            })
        }).on('error', (err) => {
            console.error(`error making request: ${err}`)
            reject(err)
        })
    })
}

const PrintMovieInformation = (movie) => {
    return new Promise(async (resolve) => {
        console.log(`Name: ${movie.title}`)
        console.log('Planets:')
        planetInfo = await ProcessPlanets(movie.planets)
        console.log(planetInfo)
        await ProcessCharacters(movie.characters)
        resolve()
    })
}

const ProcessPlanets = (planetUrls) => {
    return new Promise((resolve, reject) => {
        if (planetUrls.length > 0) {
            let data = ''
            let counter = 0
            planetUrls.forEach(async (planetUrl) => {
                const planetData = await RequestData(planetUrl)
                data += `\tName: ${planetData.name}\n`
                data += `\tName: ${planetData.name}\n`
                data += `\tTerrain: ${planetData.terrain}\n`
                data += `\tGravity: ${planetData.gravity}\n`
                data += `\tDiameter: ${planetData.diameter}\n`
                data += `\tPopulation: ${planetData.population}\n\n`
                counter++
            })

            if (counter === planetUrls.length) {
                resolve(data)
            }
        } else {
            reject()
        }
    })
}

const ProcessCharacters = (characterUrls) => {
    return new Promise((resolve, reject) => {
        if (characterUrls.length > 0) {
            characterUrls.forEach(async (characterUrl) => {
                const characterData = await RequestData(characterUrl)
                console.log(`\tName: ${characterData.name}`)
                console.log(`\tGender: ${characterData.gender}`)
                console.log(`\tHair color: ${characterData.hair_color}`)
                console.log(`\tSkin color: ${characterData.skin_color}`)
                console.log(`\tEye color: ${characterData.eye_color}`)
                console.log(`\tHeight: ${characterData.height}`)
                console.log(`\tHomeworld: ${characterData.homeworld}`)
                console.log('')
            })
            resolve()
        } else {
            reject()
        }
    })
}

RunAPI()