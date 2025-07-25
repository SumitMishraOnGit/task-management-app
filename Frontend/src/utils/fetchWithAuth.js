// Utility to handle authenticated fetch with automatic token refresh
export async function fetchWithAuth(url, options = {}) {
  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // First, check if we have tokens
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    // No tokens, redirect to login
    window.location.href = '/login';
    throw new Error('No authentication tokens found');
  }

  // Attach access token to request
  options.headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  try {
    let response = await fetch(url, options);

    // If access token expired, try to refresh
    if (response.status === 401) {
      console.log('Access token expired, attempting refresh...');
      
      // Try to refresh the token
      const refreshRes = await fetch('/users/refresh-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data.accessToken) {
          console.log('Token refreshed successfully');
          // Save new access token
          localStorage.setItem('accessToken', data.accessToken);
          
          // Retry original request with new token
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${data.accessToken}`,
          };
          
          response = await fetch(url, options);
          if (!response.ok) {
            throw new Error('Request failed after token refresh');
          }
        } else {
          throw new Error('No access token in refresh response');
        }
      } else {
        throw new Error('Token refresh failed');
      }
    }

    return response;
  } catch (error) {
    console.error('Auth Error:', error.message);
    // Clear tokens and redirect on auth errors
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
} 