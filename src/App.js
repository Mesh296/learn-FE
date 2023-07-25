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

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  const handleSelect = async value => {
    const result = await geocodeByAddress(value);
    const latlong = await getLatLng(result[0])
    setAddress(value);
    setCoordinates(latlong);
    console.log(value.description.regi);

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
                  onClick={() => handleSelect(suggestion.description)}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
            <div>--------------------------</div>
            <div>Latitude: {coordinates["lat"]}</div>
            <div>Longitude: {coordinates["lng"]}</div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

export default App;
