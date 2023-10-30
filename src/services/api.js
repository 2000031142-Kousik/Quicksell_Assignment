const BASE_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const fetchData = async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
};

export default fetchData;
