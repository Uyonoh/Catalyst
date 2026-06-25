// app/api/detect-currency/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  // Read the client IP address from Netlify's forwarded headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "8.8.8.8";

  try {
    // Call a free IP geolocation API
    const res = await fetch(`http://ip-api.com/json/197.211.63.112`);
    const data = await res.json();

    // Define your supported locations and target currencies
    const supportedCountries = {
      NG: { currency: "NGN", symbol: "₦" },
    };

    const userCountry = data.countryCode;
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
    return NextResponse.json({ error: "Failed to locate" }, { status: 500 });
  }
}
