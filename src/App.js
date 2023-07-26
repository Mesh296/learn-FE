import './App.css';
import React, { useState } from 'react';
import PlacesAutocomplete,
{
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng
}
  from 'react-places-autocomplete';



function App() {

  const [address, setAddress] = useState("") //address tren search bar
  const [postal_code, setPostal_code] = useState("") //postal code 
  const [searchedAdd, setSearchedAdd] = useState("") //selected address
  const [coordinates, setCoordinates] = useState({ //toa do
    lat: null,
    lng: null
  });
  const [country, setCountry] = useState("") //ten country
  const [shippingFee, setShippingFee] = useState("") //phi ship 

  //lay du lieu country voi shipping fee
  const getCountryData = async (nameCountry) => {
    await fetch('./CountryCodes.json')
    .then(res => res.json())
    .then(data => getFee(nameCountry, data))
  }


  //lay shipping fee cua country da duoc chon
  const getFee = async (countryName, data) => {
    const countryData = await (data.find(nameC => nameC.name === countryName))
    setShippingFee(countryData.dial_code.slice(1)) //update shipping fee len man hinh
  }


  //show thong tin dia chi len man hinh
  const handleSelect = async (value, placeId) => {
    const result = await geocodeByAddress(value); //lay du lieu country
    const latlong = await getLatLng(result[0]) //lay toa do country
    setAddress(value); //update dia chi tren search bar
    setSearchedAdd(value); //update dia chi len man hinh
    setCoordinates(latlong); //update toa do len man hinh
    
    const [place] = await geocodeByPlaceId(placeId); //get ID country
    const { long_name: postalCode = '' } =
    place.address_components.find(c => c.types.includes('postal_code')) || {}; //get Postal code
    setPostal_code(postalCode); //update Postal code len man hinh

    const { long_name: countr = ''} = 
    result[0].address_components.find(c => c.types.includes('country')) || {}; //get country name

    setCountry(countr); //update country name len man hinh
    
    getCountryData(countr); //fetch api

   }


  return (
    <div className="App">
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
        (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />

            <div>
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                //-------------------------------
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  onClick={() => handleSelect(suggestion.description, suggestion.placeId)}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
            <div>--------------------------</div>
            <div>Latitude: {coordinates["lat"]}</div>
            <div>Longitude: {coordinates["lng"]}</div>
            <div>Address: {searchedAdd}</div>
            <div>Postal Code: {postal_code}</div>
            <div>Country: {country}</div>
            <div>Shipping fee: {shippingFee}</div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

export default App;
