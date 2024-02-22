import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LocationSelector from './components/LocationSelector';
import ResultsList from './components/ResultsList';
import config from './config.json';

function App() {
  const officeLocations = config.locations || [];

  return (
    <>
      <CssBaseline />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100dvw',
          position: 'fixed',
          height: "100vh",
        }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Bobafind
              </Typography>
            </Toolbar>
          </AppBar>
          <LocationSelector locations={officeLocations} />
          <ResultsList></ResultsList>
        </Box>
    </>
      
  )
}

export default App
