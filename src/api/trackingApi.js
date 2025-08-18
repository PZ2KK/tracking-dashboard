import axios from "axios";

const API_BASE = "http://localhost:4000";

const trackingApi = {
  getAll: async (params = {}) => {
    const { _page, _limit, q, status, _sort, _order, ...rest } = params;
    const queryParams = new URLSearchParams();
    
    if (_page) queryParams.append('_page', _page);
    if (_limit) queryParams.append('_limit', _limit);
    
    if (q) {
      queryParams.append('name_like', q);
      queryParams.append('id_like', q);
    }
    
    if (status) queryParams.append('status', status);
    if (_sort) queryParams.append('_sort', _sort);
    if (_order) queryParams.append('_order', _order);
    
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    let url = `${API_BASE}/trackings`;
    
    if (q) {

      url = `${url}?name_like=${encodeURIComponent(q)}&id_like=${encodeURIComponent(q)}`;
      queryParams.delete('name_like');
      queryParams.delete('id_like');
      const otherParams = queryParams.toString();
      if (otherParams) {
        url += `&${otherParams}`;
      }
    } else {
      const paramsString = queryParams.toString();
      if (paramsString) {
        url += `?${paramsString}`;
      }
    }

    const response = await axios.get(url);
    if (q) {
      const searchTerm = q.toLowerCase();
      response.data = response.data.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.id.toLowerCase().includes(searchTerm)
      );
    }
    return response;
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