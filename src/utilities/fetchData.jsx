export const fetchData = async (apiUrl, method, setFunction, setError, setLoading, body) => {
  if (typeof setLoading === 'function') setLoading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      if (typeof setFunction === 'function') setFunction(data.data);
    } else {
      if (typeof setError === 'function') setError(data.message || 'Failed to fetch data.');
    }
    return data.data;
  } catch (err) {
    if (typeof setError === 'function') setError(err.message || 'Something went wrong. Please try again.');
  } finally {
    if (typeof setLoading === 'function') setLoading(false);
  }
};