import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error.response?.data || { message: "Network Error" };
  }
};


export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error.response?.data || { message: "Invalid OTP" };
  }
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};