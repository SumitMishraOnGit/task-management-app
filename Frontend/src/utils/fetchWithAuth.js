// Frontend/src/utils/fetchWithAuth.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchWithAuth(url, options = {}) {
  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    throw new Error('No authentication tokens found');
  }

  options.headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  try {
    let response = await fetch(`${API_BASE_URL}${url}`, options);

    if (response.status === 401) {
      console.log('Access token expired, attempting refresh...');
      const refreshRes = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data.accessToken) {
          console.log('Token refreshed successfully');
          localStorage.setItem('accessToken', data.accessToken);
          options.headers['Authorization'] = `Bearer ${data.accessToken}`;
          
          // Retry the original request
          response = await fetch(`${API_BASE_URL}${url}`, options);
        } else {
          throw new Error('No access token in refresh response');
        }
      } else {
        throw new Error('Token refresh failed');
      }
    }

    if (!response.ok) {
        // If the response is not JSON, we throw a more specific error.
        const errorText = await response.text();
        console.error("Server responded with an error:", errorText);
        throw new Error(`Request failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Auth Error:', error.message);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
}