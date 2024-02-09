const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

//validate the habitable planets
function isHabitablePlanet (planet) {
    return planet ['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet ['koi_prad'] < 1.6;
}

//sort the habitable planets from Radius
function sortPlanets(planets, sortBy) {
    return planets.sort((a, b) => {
        if(a[sortBy] < b[sortBy]) return -1;
        if(a[sortBy] > b[sortBy]) return 1;
        return 0; 
    })
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true,
    })) 
    .on('data', (data) => {
        if(isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name'];
        }))
        console.log(`${habitablePlanets.length} habitable planets found!`)
        const sortedByRadius = sortPlanets(habitablePlanets, 'koi_prad');

        console.log("Habitable planets sorted by radius:");
        sortedByRadius.forEach(planet => {
            console.log(`${planet['kepler_name']} - Radius: ${planet['koi_prad']}`);
        });
    });
    

