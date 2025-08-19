import axios from "axios";

const API_BASE = "https://tracking-backend-mohh.onrender.com/"
const DELAY_MS = 600; // artificial delay to allow skeletons to be visible

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const trackingApi = {
  getAll: async (params = {}) => {
    const { _page = 1, _limit = 10, q, status, _sort = 'id', _order = 'asc', ...rest } = params;
    // Remove pagination params from the all-fetch request
    const { _page: _omitPage, _start: _omitStart, _limit: _omitLimit, ...restNoPag } = rest;

    // Always fetch all for consistent client-side filtering/slicing
    const allParams = {
      _sort,
      _order,
      ...(status && { status }),
      ...restNoPag
    };
    const allUrl = `${API_BASE}/trackings?${new URLSearchParams(allParams).toString()}`;
    console.log('[trackingApi] GET (all)', allUrl);
    const allRes = await axios.get(allUrl);
    let data = Array.isArray(allRes.data) ? allRes.data : [];
    // Apply search filter client-side if q is provided
    if (q && String(q).trim() !== '') {
      const term = String(q).toLowerCase();
      data = data.filter(item => {
        const name = String(item.name || '').toLowerCase();
        const idStr = String(item.id || '').toLowerCase();
        return name.includes(term) || idStr.includes(term);
      });
    }
    const total = data.length;
    const start = Object.prototype.hasOwnProperty.call(params, '_start')
      ? Number(params._start) || 0
      : (_page - 1) * _limit;
    const sliced = data.slice(start, start + _limit);
    // Artificial delay so UI can render skeletons during loading
    await delay(DELAY_MS);
    return { data: sliced, total };
  },
  
  // Returns total number of items matching the filters in params
  count: async (params = {}) => {
    const { q, status, _sort = 'id', _order = 'asc', ...rest } = params;
    // Remove pagination params from the all-fetch request
    const { _page: _omitPage, _start: _omitStart, _limit: _omitLimit, ...restNoPag } = rest;
    const allParams = {
      _sort,
      _order,
      ...(status && { status }),
      ...restNoPag
    };
    const allUrl = `${API_BASE}/trackings?${new URLSearchParams(allParams).toString()}`;
    const allRes = await axios.get(allUrl);
    let data = Array.isArray(allRes.data) ? allRes.data : [];
    if (q && String(q).trim() !== '') {
      const term = String(q).toLowerCase();
      data = data.filter(item => {
        const name = String(item.name || '').toLowerCase();
        const idStr = String(item.id || '').toLowerCase();
        return name.includes(term) || idStr.includes(term);
      });
    }
    return data.length;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API_BASE}/trackings/${id}`);
    return response;
  },
  
  // Patch a tracking with partial fields (e.g., increment votes)
  patchTracking: async (id, data) => {
    const response = await axios.patch(`${API_BASE}/trackings/${id}`, data);
    return response;
  },

  vote: async (trackingId, userId, score = 1) => {
    await delay(DELAY_MS);
    const response = await axios.patch(`${API_BASE}/trackings/${trackingId}`, {
      votes: { [userId]: score }
    });
    return response.data;
  },

  getChartSummary: async () => {
    await delay(DELAY_MS);
    const response = await axios.get(`${API_BASE}/chart/summary`);
    return response.data;
  },
};

export default trackingApi;