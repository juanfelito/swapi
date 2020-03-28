const https = require('https')

let data

const planets = 0
const characters = 1
const species = 2
const starships = 3

const RunAPI = async () => {
    const apiData = await requestData('https://swapi.co/api/films/')
    const paginatedLinks = ['planets', 'people', 'species', 'starships']

    data = await Promise.all(paginatedLinks.map(link => requestPaginatedData(`https://swapi.co/api/${link}/`)))

    let response = {
        movies: []
    }
    if (apiData.count && apiData.count > 0) {
        apiData.results.sort((a, b) => { return a.episode_id - b.episode_id })
        for (let movie of apiData.results) {
            response.movies.push(printMovieInformation(movie))
        }
    } else {
        console.log("There was an error or there are zero movies available")
    }
    return response
}

const requestData = (url) => {
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

const requestPaginatedData = (url) => {
    return new Promise(async resolve => {
        let requestUrl = url
        let hasNextPage = true
        let data = new Map()

        while (hasNextPage) {
            const page = await requestData(requestUrl)
            for (let element of page.results) {
                data.set(element.url, element)
            }

            if (page.next) {
                requestUrl = page.next
            } else {
                hasNextPage = false
            }
        }

        resolve(data)
    })
}

const printMovieInformation = (movie) => {
    return {
        name: movie.title,
        planets: processPlanets(movie.planets),
        characters: processCharacters(movie.characters),
        biggest_starship: processStarships(movie.starships)
    }
}

const processPlanets = (planetUrls) => {
    let response = []
    if (planetUrls.length > 0) {
        planetUrls.forEach(planetUrl => {
            const planetData = data[planets].get(planetUrl)

            response.push({
                name: planetData.name,
                terrain: planetData.terrain,
                gravity: planetData.gravity,
                diameter: planetData.diameter,
                population: planetData.population,
            })
        })
    }
    return response
}

const processCharacters = (characterUrls) => {
    let response = []
    if (characterUrls.length > 0) {
        characterUrls.forEach(characterUrl => {
            const characterData = data[characters].get(characterUrl)

            let character = {
                name: characterData.name,
                gender: characterData.gender,
                hair_color: characterData.hair_color,
                skin_color: characterData.skin_color,
                eye_color: characterData.eye_color,
                height: characterData.height,
                homeworld: data[planets].get(characterData.homeworld).name
            }

            if (characterData.species.length > 0) {
                const speciesInfo = data[species].get(characterData.species[0])
                character.species = {
                    name: speciesInfo.name,
                    language: speciesInfo.language,
                    average_height: speciesInfo.average_height,
                }
            } else {
                character.species = "unknown"
            }

            response.push(character)
        })
    }

    return response
}

const processStarships = (starshipUrls) => {
    let starshipsInMovie = []
    starshipUrls.forEach(url => {
        starshipsInMovie.push(data[starships].get(url))
    })

    starshipsInMovie.sort(function (a, b) { return b.cargo_capacity - a.cargo_capacity })
    return {
        name: starshipsInMovie[0].name,
        model: starshipsInMovie[0].model,
        manufacturer: starshipsInMovie[0].manufacturer,
        passangers: starshipsInMovie[0].passengers
    }
}

module.exports = RunAPI
