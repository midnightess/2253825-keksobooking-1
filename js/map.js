import { createAdvertCard } from './popup-card.js';
import { toggleFormState } from './form-settings.js';

const LAT_DEFAULT = 35.68951;
const LNG_DEFAULT = 139.69171;
const ZOOM_DEFAULT = 12;
const BIT_DEPTH_DEFAULT = 5;
const TITLE_DEFAULT = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TITLE_ATTRIBUT_DEFAULT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ADDRESS = document.querySelector('#address');

const MAP = L.map('map-canvas');

const markerGroup = L.layerGroup().addTo(MAP);

const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});


const innerPinIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});


const createMainMarker = L.marker(
  {
    lat: LAT_DEFAULT,
    lng: LNG_DEFAULT,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  }
);


const onMovingMainMarker = (evt) => {
  const coordinates = evt.target.getLatLng();
  ADDRESS.value = `${coordinates.lat.toFixed(BIT_DEPTH_DEFAULT)}, ${coordinates.lng.toFixed(BIT_DEPTH_DEFAULT)}`;
};


const renderInnerMarker = (offer) => {
  const {location} = offer;
  const innerMarker = L.marker(
    {
      lat: location.lat,
      lng: location.lng,
    },
    {
      icon: innerPinIcon,
    }
  );
  innerMarker
    .addTo(markerGroup)
    .bindPopup(createAdvertCard(offer));
};

const renderMarkers = (markers) => {

  markers.forEach ((marker) => {
    renderInnerMarker(marker);
  });
};


const getRenderedMap = (markers) => {

  MAP.on('load', () => {
    toggleFormState(false);
  })
    .setView(
      {
        lat: LAT_DEFAULT,
        lng: LNG_DEFAULT,
      }, ZOOM_DEFAULT);

  L.tileLayer(
    TITLE_DEFAULT,
    {
      attribution: TITLE_ATTRIBUT_DEFAULT,
    },
  ).addTo(MAP);

  ADDRESS.value = `${LAT_DEFAULT}, ${LNG_DEFAULT}`;

  renderMarkers(markers);
  createMainMarker.addTo(MAP);
  createMainMarker.on('move', onMovingMainMarker);
};


export { getRenderedMap };