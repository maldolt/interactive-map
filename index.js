//something about a map lol
const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},

    //build the map
    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 11,
        });

        //tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
        //marker
        const marker = L.marker(this.coordinates)
        marker
        .addTo(this.map)
        .bindPopup("I am a pop up").openPopup();
    },

    //business markers
    addMarkers() {
        for (var i= 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
            .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map)
        }
    },

}
//coordinates api
async function getCoords(){
    const pos= await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}
//foursquare
async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3WMxm/3ul5T9vAkeNSbd5EbciYODsyJ6C3fFW5JvibVQ='
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch ()
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return business

}

function processBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitutde
        };
        return location
    })
    return businesses
}

//window onload
window.onload = async () => {
    const coords = await getCoords()
    myMap.coordinates = coords
    myMap.buildMap()
}

//submit button
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await getFoursquare(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
})