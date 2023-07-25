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

  const [address, setAddress] = useState("")
  const [postal_code, setPostal_code] = useState("")
  const [searchedadd, setSearchedadd] = useState("")
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  const handleSelect = async (value, placeId) => {
    const result = await geocodeByAddress(value);
    const latlong = await getLatLng(result[0])
    setAddress(value);
    setSearchedadd(value);
    setCoordinates(latlong);
    
    const [place] = await geocodeByPlaceId(placeId);
    const { long_name: postalCode = '' } =
    place.address_components.find(c => c.types.includes('postal_code')) || {};
    console.log(placeId);
    setPostal_code(postalCode);

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
                    {console.log(suggestion.placeId)}
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
            <div>--------------------------</div>
            <div>Latitude: {coordinates["lat"]}</div>
            <div>Longitude: {coordinates["lng"]}</div>
            <div>Address: {searchedadd}</div>
            <div>Postal Code: {postal_code}</div>

          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

export default App;
