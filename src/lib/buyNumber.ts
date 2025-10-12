import axios from "axios";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export type ResType = {
  status: boolean;
  data: {
    id: number;
    phone: string;
    operator: string;
    country: string;
    countryCode: string;
  } | null;
};

type PropType = {
  countryName: string;
  countryCode: string;
  apiCountryName: string;
} | null;

export async function buyNumber(prop: PropType): Promise<ResType> {
  try {
    const country = prop?.apiCountryName ? prop?.apiCountryName : "england";
    const operator = "any";
    const product = "amazon";

    const res = await axios.get(
      `https://5sim.net/v1/user/buy/activation/${country}/${operator}/${product}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NumberApi}`,
          Accept: "application/json",
        },
      }
    );

    if (res.status === 200) {
      const parsed = parsePhoneNumberFromString(res.data.phone);
      let country;
      let phone;
      if (parsed) {
        country = parsed.country;
        phone = parsed.nationalNumber;
      }

      return {
        status: true,
        data: {
          id: res.data.id,
          phone: phone || res.data.phone,
          operator: res.data.operator,
          country: country || res.data.country,
          countryCode: prop?.countryCode ? prop?.countryCode : "GB",
        },
      };
    }
    return {
      status: false,
      data: null,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
}
