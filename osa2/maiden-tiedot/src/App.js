import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ filterText, setFilterText }) => {

  return (
    <div>
        find countries {" "}
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
  )
}



const CountryDetails = ({ country }) => {
  
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital?.[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => <li key={language}>{language}</li> )}
      </ul>
      <img src={country.flags.png} height="200px" alt="country flag"/>
    </div>

  )
}


const App = () => {

  const [filterText, setFilterText] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)



  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data);
        console.log(response.data)
      })
    
  }, []); 


  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterText.toLowerCase())
  )



  const CountryInformation = () => {

    if (filteredCountries.length == 1) {
      const country = filteredCountries[0]

      return (
        <p>jees</p>
      )
    }
   
    if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
      return (
        filteredCountries.map((country) => (
      
          <p key={country.cca3}>
            {country.name.common} 
          </p>
      
        ))
      )
    }

    if (filteredCountries.length == 0) {
      return <p>No countries, change filter</p>
    }

    else {

      return (
        <p>Too many countries, specify another filter</p>
      )
    }

  }


  return (
    <div>
      
      <Filter filterText={filterText} setFilterText={setFilterText} />

      <CountryInformation/>
      
    </div>
  );
}



export default App
