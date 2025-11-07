import axios from "axios";
const LOS_API_KEY = process.env.LOS_API_KEY;
const LOS_URL = "https://api.loanoperation.com/status";
export async function getLoanStatus(applicationId) {
  const response = await axios.get(`${LOS_URL}/${applicationId}`, {
    headers: { Authorization: `Bearer ${LOS_API_KEY}` },
  });
  return response.data.status;
}
