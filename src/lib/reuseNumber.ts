import axios from "axios";
export async function reUseNumber(phoneNumber: string) {
  try {
    console.log(phoneNumber);
    const product = "amazon";
    const res = await axios.get(
      `https://5sim.net/v1/user/reuse/${product}/${phoneNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NumberApi}`,
          Accept: "application/json",
        },
      }
    );

    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
