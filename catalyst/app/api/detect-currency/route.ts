import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Read the client IP address from Netlify's forwarded headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "8.8.8.8";

  interface CountryDetails {
   currency: string;
   symbol: string;
  };
  
  type supportedCountryCodes = "NG" | "US";
  type Countries = Record<supportedCountryCodes, CountryDetails>

  try {
    // Call a free IP geolocation API
    // const ip = "197.211.63.102";
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();

    // Define your supported locations and target currencies
    const supportedCountries: Countries = {
      "NG": { currency: "NGN", symbol: "₦" },
      "US": { currency: "USD", symbol: "$" },
    };

    const userCountry: supportedCountryCodes = data.countryCode;
    console.log("data: ", data);

    if (userCountry && supportedCountries[userCountry]) {
      return NextResponse.json({
        supported: true,
        currencyData: supportedCountries[userCountry],
      });
    }

    return NextResponse.json({
      supported: false,
      currencyData: { currency: "USD", symbol: "$" },
    });
  } catch (error) {
    console.error("Failed to locate user with error: ", error);
    return NextResponse.json({ error: "Failed to parse location" }, { status: 500 });
  }
}
