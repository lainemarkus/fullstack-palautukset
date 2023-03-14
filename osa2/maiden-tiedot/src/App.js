import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'


const Filter = ({ filterText, handleSelectedCountryChange, handleFilterChange }) => {
  return (
    <div>
        find countries <input
          type="text"
          value={filterText}
          onChange={(event) => {
            handleFilterChange(event)
            handleSelectedCountryChange(null)
          }}
        />
    </div>
  )
}


//This function is used to render the details of a single country. It also gets the weather data from openweathermap API. It is called in the CountryInformation component. 
const CountryDetails = ({ country }) => {

  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null);


  useEffect(() => {
    const timeout = setTimeout(() => {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${process.env.REACT_APP_API_KEY}`)
        .then(response => {
          setWeather(response.data)
          console.log(response.data)
        })
        .catch(error => {
          console.error(error)
          setError(error)

        })
    }, 1000)
  
    return () => clearTimeout(timeout)
  }, [country.capital])


  return (
    <>
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital?.[0]}</p>
        <p>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((language) => <li key={language}>{language}</li> )}
        </ul>
        <img src={country.flags.png} height="200px" alt="country flag"/>
 
      </div>
      {weather && (
        <div>
          <h2>Weather in {country.capital?.[0]}</h2>
          <p>temperature: {Math.round(weather.main.temp - 273.15)}°C</p>  
          <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="weather"/>
          <p>wind: {weather.wind.speed} m/s</p>
        </div>
      )}
      {error && <p>Failed to fetch weather data.</p>}
    </>
  )
}

//This function takes care of showing the data of the application. It uses the CountryDetails component 
//to show detailed info about a country, a list of countries or a message, depending on the filter state.
const CountryInformation = ({ 
  filteredCountries, 
  selectedCountry, 
  showDetails, 
  handleSelectedCountryChange, 
  handleShowDetailsChange
}) => {

const handleCountrySelection = useCallback((country) => {
  handleSelectedCountryChange(country);
  handleShowDetailsChange(true);
}, [handleSelectedCountryChange, handleShowDetailsChange]);


  useEffect(() => {
    if (filteredCountries.length === 1) {
      handleCountrySelection(filteredCountries[0])
    }
  }, [filteredCountries, handleCountrySelection]);

  if (selectedCountry !== null && showDetails) {
    return <CountryDetails country = {selectedCountry}/>
  }

  if (filteredCountries.length > 10) {
    return <p>Too many countries, specify another filter</p>
  }

  if (filteredCountries.length === 0) {
    return <p>No countries, specify another filter</p>
  }


  return (
    <div>
      {filteredCountries.map((country) => (
        <p key={country.cca3}>
          {country.name.common} <button onClick={() => handleCountrySelection(country)}>show</button>
        </p> 

      ))}
    </div>
  )
}



const App = () => {

  const [filterText, setFilterText] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [showDetails, setShowDetails] = useState(false)



  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data);
        console.log(response.data)
      })
  }, []);


  


  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
    setSelectedCountry(null)
    setShowDetails(false)
  }


  return (
    <div>
      <Filter filterText={filterText} handleSelectedCountryChange={setSelectedCountry} handleFilterChange={handleFilterChange}/>

      <CountryInformation filteredCountries={countries.filter((country) =>
        country.name.common.toLowerCase().includes(filterText.toLowerCase()))} 
        selectedCountry={selectedCountry} 
        showDetails={showDetails} 
        handleSelectedCountryChange={setSelectedCountry} 
        handleShowDetailsChange={setShowDetails}
      />
    </div>
  );
}

export default App 