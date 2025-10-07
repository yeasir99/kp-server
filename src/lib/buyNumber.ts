import axios from "axios";
export async function buyNumber() {
  try {
    const country = "usa";
    const operator = "any";
    const product = "amazon";

    console.log(process.env.NumberApi);

    const res = await axios.get(
      `https://5sim.net/v1/user/buy/activation/${country}/${operator}/${product}`,
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
