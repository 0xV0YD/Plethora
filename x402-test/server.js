import { config } from "dotenv";
import express from "express";
import { paymentMiddleware} from "x402-express";
config();

const facilitatorUrl = process.env.FACILITATOR_URL;
const payTo = process.env.ADDRESS;

console.log(facilitatorUrl)
if (!facilitatorUrl || !payTo) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

app.use(
  paymentMiddleware(
    payTo,
    {
      "GET /weather": {
        // USDC amount in dollars
        price: "$0.00001",
        // network: "base" // uncomment for Base mainnet
        network: "solana-devnet",
      },
    "/premium/*": {
            price: "$0.00005", // $0.005 per request
            network: "solana-devnet",
            },
    },
    {
      url: facilitatorUrl,
    },
  ),
);

app.get("/weather", (req, res) => {
  res.send({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

app.get("/premium/content", (req, res) => {
  res.send({
    content: "This is premium content",
  });
});

app.listen(4021, () => {
  console.log(`Server listening at http://localhost:${4021}`);
});