import { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useSearchParams } from "react-router-dom";

function LocationSelector({ locations }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationsQuery = searchParams.getAll("location");
  const filterdLocations = locations.filter(l => {
    if (locationsQuery && locationsQuery.length > 0){
      return locationsQuery.includes(l.address);
    } else {
      return true
    }
  });

  const [offices, setOffices] = useState(() => filterdLocations);
  const handleLocation = (event, newOffices) => {
    setSearchParams({ location: newOffices.map(o => o.address) });
    setOffices(newOffices);
  };

  return (
  <ToggleButtonGroup
    value={offices}
    onChange={handleLocation}
    aria-label="office location"
  >
      {locations.map((location, idx) => (
      <ToggleButton key={idx} value={location}>
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