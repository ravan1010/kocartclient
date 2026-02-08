import api from "../api";

export const logout = async () => {
  try {
    const res = await api.post("/api/logout"); // credentials already included
    alert(res.data.message);

    // clear client state (Redux, Context, localStorage)
    localStorage.removeItem("at");
    // navigate to login page
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err.response?.data || err.message);
  }
};
