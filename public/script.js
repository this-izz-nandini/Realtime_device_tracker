const socket=io();

//check if browser supports geolocation
if(navigator.geolocation){
    // continuously track users location using watchPosition
    navigator.geolocation.watchPosition(
    (pos)=>{
        const {latitude, longitude} = pos.coords;
        socket.emit('send-location',{latitude, longitude});
    }, (e)=>{
        console.error(e);
    },{
        enableHighAccuracy: true,
        maximumAge:0,   //no caching
        timeout:5000,   //refresh
    });
}

// L.map('map');   asks for user's location
const map = L.map('map').setView([0,0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"You're being tracked"
}).addTo(map);

const markers='';

socket.on('receive-location',(data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }else{
        markers[id]=L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on('user-disconnected',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})