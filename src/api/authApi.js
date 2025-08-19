import axios from "axios";

const API_BASE = "https://tracking-backend-mohh.onrender.com";

export const loginApi = async (username, password) => {
  if (!username || !password) {
    return { success: false, message: "Missing credentials" };
  }

  const res = await axios.get(`${API_BASE}/users`, {
    params: { username, password },
  });

  if (res.data.length > 0) {
    const user = res.data[0];

    const token = `fake-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, user, token };
  }

  return { success: false, message: "Invalid username or password" };
};
