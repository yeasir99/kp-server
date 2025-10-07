import axios from "axios";

export async function checkSMS(id: string) {
  try {
    const response = await axios.get(`https://5sim.net/v1/user/check/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NumberApi}`,
        Accept: "application/json",
      },
    });

    console.log(response);
    return response.data;
  } catch (err: unknown) {
    console.log(err);
    // Narrow the error type
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.response?.data || err.message);
    } else if (err instanceof Error) {
      console.error("General error:", err.message);
    } else {
      console.error("Unknown error:", err);
    }
  }
}
