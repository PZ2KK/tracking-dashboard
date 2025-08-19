import axios from "axios";

const API_BASE = "http://localhost:4000";

const trackingApi = {
  getAll: async (params = {}) => {
    const { _page = 1, _limit = 10, q, status, _sort = 'id', _order = 'asc', ...rest } = params;
    
    // Prefer offset-based pagination if _start is provided; else use _page
    const usingOffset = Object.prototype.hasOwnProperty.call(params, '_start');
    const queryParams = {
      ...(usingOffset ? {} : { _page }),
      ...(usingOffset ? { _start: params._start } : {}),
      _limit,
      _sort,
      _order,
      ...(q && { q }),
      ...(status && { status }),
      ...rest
    };
    
    // Remove undefined or empty values
    Object.keys(queryParams).forEach(key => 
      (queryParams[key] === undefined || queryParams[key] === '') && delete queryParams[key]
    );
    
    const url = `${API_BASE}/trackings?${new URLSearchParams(queryParams).toString()}`;
    console.log('[trackingApi] GET', url);

    const response = await axios.get(url);
    if (q) {
      const searchTerm = String(q).toLowerCase();
      response.data = response.data.filter(item => {
        const name = String(item.name || '').toLowerCase();
        const idStr = String(item.id || '').toLowerCase();
        return name.includes(searchTerm) || idStr.includes(searchTerm);
      });
    }
    return response;
  },
  
  // Returns total number of items matching the filters in params
  count: async (params = {}) => {
    const { q, status, _sort = 'id', _order = 'asc', ...rest } = params;
    const queryParams = {
      _page: 1,
      _limit: 1,
      _sort,
      _order,
      ...(q && { q }),
      ...(status && { status }),
      ...rest
    };
    Object.keys(queryParams).forEach(key => 
      (queryParams[key] === undefined || queryParams[key] === '') && delete queryParams[key]
    );
    const url = `${API_BASE}/trackings?${new URLSearchParams(queryParams).toString()}`;
    const response = await axios.get(url);
    const headerCount = response.headers?.['x-total-count'] || response.headers?.['X-Total-Count'];
    if (headerCount) return Number(headerCount);
    // Fallback: fetch all without pagination and apply same client-side search filter
    const allParams = {
      _sort,
      _order,
      ...(status && { status }),
      ...rest
    };
    const allUrl = `${API_BASE}/trackings?${new URLSearchParams(allParams).toString()}`;
    const allRes = await axios.get(allUrl);
    let data = Array.isArray(allRes.data) ? allRes.data : [];
    if (q) {
      const searchTerm = String(q).toLowerCase();
      data = data.filter(item => {
        const name = String(item.name || '').toLowerCase();
        const idStr = String(item.id || '').toLowerCase();
        return name.includes(searchTerm) || idStr.includes(searchTerm);
      });
    }
    return data.length;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API_BASE}/trackings/${id}`);
    return response;
  },
  
  vote: async (trackingId, userId, score = 1) => {
    const response = await axios.post(`${API_BASE}/votes`, { 
      trackingId, 
      userId, 
      score,
      timestamp: new Date().toISOString()
    });
    return response;
  }
};

export default trackingApi;