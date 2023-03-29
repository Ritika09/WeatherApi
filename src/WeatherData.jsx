import { useState, useEffect } from 'react';

function calculateMean(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

function calculateMedian(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  const sortedNumbers = numbers.sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length / 2);

  if (sortedNumbers.length % 2 === 0) {
    return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  } else {
    return sortedNumbers[middleIndex];
  }
}

function calculateMode(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  const numberCount = {};
  let maxCount = 0;
  let mode = 0;

  numbers.forEach((number) => {
    if (numberCount[number] === undefined) {
      numberCount[number] = 1;
    } else {
      numberCount[number]++;
    }

    if (numberCount[number] > maxCount) {
      maxCount = numberCount[number];
      mode = number;
    }
  });

  return mode;
}

function WeatherData() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=New York&key=0ea6a027fbb4421891eb19f517de2ba8&days=7`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data.data);
    };

    fetchWeatherData();
  }, []);

  // function to filter the data
  const filteredData = data.filter((item) => {
    // filter by search query
    if (searchQuery !== '' && !item.city_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // filter by category
    if (filter !== '' && item.category !== filter) {
      return false;
    }

    return true;
  });

  // handle input change for search bar
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // handle input change for filter
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className='weather-data-container'>
      <h1>Weather Data</h1>

      {/* search bar */}
      <input type="text" value={searchQuery} onChange={handleSearchInputChange} className='search-container' />

      {/* filter */}
      <select value={filter} onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="Rain">Rain</option>
        <option value="Snow">Snow</option>
      </select>

      <ul >
        {/* display filtered data */}
        {filteredData.map((item) => (
          <li key={item.ts}>
            {item.city_name} - {item.temp}°C - {item.weather.description}
          </li>
        ))}
      </ul>

      <div>
        {/* display summary statistics */}
        <p>Mean Temperature: {      calculateMean(filteredData.map((item) => item.temp)).toFixed(2)}°C</p>
        <p>Median Temperature: {calculateMedian(filteredData.map((item) => item.temp)).toFixed(2)}°C</p>
        <p>Mode Weather Description: {calculateMode(filteredData.map((item) => item.weather.description))}</p>
    </div>

</div>

  );
}

export default WeatherData;
