import "./App.css";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentData, setCurrentData] = useState({
    country: null,
    state: null,
    city: null,
  });

  // Fetch countries on component mount
  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states when a country is selected
  const fetchStates = useCallback((country) => {
    setCurrentData((prev) => ({
      ...prev,
      country: country,
    }));
    fetch(
      `https://crio-location-selector.onrender.com/country=${country}/states`
    )
      .then((response) => response.json())
      .then((data) => setStates(data))
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  // Fetch cities when a state is selected
  const fetchCities = useCallback((state, country) => {
    setCurrentData((prev) => ({
      ...prev,
      state: state,
    }));
    fetch(
      `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
    )
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  return (
    <div className="App">
      <h2>Select Location</h2>
      <div
        className="location-select"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <select
          id="country-select"
          style={{ marginRight: "10px", minWidth: "150px", height: "30px" }}
          onChange={(e) => {
            const selectedCountry = e.target.value;
            setStates([]);
            setCities([]);
            fetchStates(selectedCountry);
          }}
          defaultValue=""
        >
          <option disabled selected value="">
            Select Country
          </option>
          {countries?.map((country) => {
            return (
              <option key={country} value={country}>
                {country}
              </option>
            );
          })}
        </select>
        <select
          id="state-select"
          style={{ marginRight: "10px", minWidth: "150px", height: "30px" }}
          disabled={!states.length}
          onChange={(e) => {
            const selectedState = e.target.value;
            setCities([]);
            fetchCities(selectedState, currentData.country);
          }}
          defaultValue=""
        >
          <option disabled selected value="">
            Select State
          </option>
          {states?.length &&
            states?.map((state) => {
              return (
                <option key={state} value={state}>
                  {state}
                </option>
              );
            })}
        </select>
        <select
          id="city-select"
          style={{ minWidth: "150px", height: "30px" }}
          disabled={!cities.length}
          onChange={(e) => {
            const selectedCity = e.target.value;
            setCurrentData((prev) => ({
              ...prev,
              city: selectedCity,
            }));
          }}
          defaultValue=""
        >
          <option disabled selected value="">
            Select City
          </option>
          {cities?.length &&
            cities?.map((city) => {
              return (
                <option key={city} value={city}>
                  {city}
                </option>
              );
            })}
        </select>
      </div>
      {currentData?.country && currentData?.state && currentData?.city && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>
            You selected {currentData.city}, {currentData.state},{" "}
            {currentData.country}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
