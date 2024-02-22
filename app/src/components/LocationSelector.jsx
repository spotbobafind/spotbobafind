import { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useSearchParams } from "react-router-dom";

function LocationSelector({ locations }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationsQuery = searchParams.get("location");
  const validatedLocation = locations.find(l => l.id === locationsQuery) || locations[0];  
  const [curLocation, setCurLocation] = useState(validatedLocation.id);
  const handleLocation = (event, newLocation) => {
    setSearchParams(oldParams => {
      const params = new URLSearchParams(oldParams.toString());
      params.set("location", newLocation);
      return params;
    });
    setCurLocation(newLocation);
  };

  return (
  <ToggleButtonGroup
    exclusive
    value={curLocation}
    onChange={handleLocation}
  >
      {locations.map((location, idx) => (
      <ToggleButton key={idx} value={location.id}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {location.label}
        </Typography>
      </ToggleButton >
    ))}
  </ToggleButtonGroup>
  )
}

LocationSelector.propTypes = {
  locations: PropTypes.array.isRequired
}

export default LocationSelector;