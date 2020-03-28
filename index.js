const https = require('https')

const RunAPI = async () => {
    const apiData = await RequestData('https://swapi.co/api/films/')

    if (apiData.count && apiData.count > 0) {
        for (const movie of apiData.results) {
            await PrintMovieInformation(movie)
        }
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
        await ProcessPlanets(movie.planets)
        console.log('Characters:')
        await ProcessCharacters(movie.characters)
        resolve()
    })
}

const ProcessPlanets = (planetUrls) => {
    return new Promise(async (resolve, reject) => {
        if (planetUrls.length > 0) {
            for (const planetUrl of planetUrls) {
                const planetData = await RequestData(planetUrl)
                console.log(`\tName: ${planetData.name}`)
                console.log(`\tTerrain: ${planetData.terrain}`)
                console.log(`\tGravity: ${planetData.gravity}`)
                console.log(`\tDiameter: ${planetData.diameter}`)
                console.log(`\tPopulation: ${planetData.population}`)
                console.log('')                
            }
            resolve()
        } else {
            reject()
        }
    })
}

const ProcessCharacters = (characterUrls) => {
    return new Promise(async (resolve, reject) => {
        if (characterUrls.length > 0) {
            for (const characterUrl of characterUrls) {
                const characterData = await RequestData(characterUrl)
                console.log(`\tName: ${characterData.name}`)
                console.log(`\tGender: ${characterData.gender}`)
                console.log(`\tHair color: ${characterData.hair_color}`)
                console.log(`\tSkin color: ${characterData.skin_color}`)
                console.log(`\tEye color: ${characterData.eye_color}`)
                console.log(`\tHeight: ${characterData.height}`)
                console.log(`\tHomeworld: ${characterData.homeworld}`)
                console.log('')
            }
            resolve()
        } else {
            reject()
        }
    })
}

RunAPI()