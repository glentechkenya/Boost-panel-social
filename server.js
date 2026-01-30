const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const API_URL = "https://exosupplier.com/api/v2";
const API_KEY = process.env.API_KEY;

async function sendRequest(params) {
  const formData = new URLSearchParams();
  formData.append("key", API_KEY);

  for (const key in params) {
    formData.append(key, params[key]);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData
  });

  return response.json();
}

// Get all services
app.get("/services", async (req, res) => {
  const data = await sendRequest({ action: "services" });
  res.json(data);
});

// Place order
app.post("/order", async (req, res) => {
  const { service, link, quantity } = req.body;
  const data = await sendRequest({
    action: "add",
    service,
    link,
    quantity
  });
  res.json(data);
});

// Check order status
app.get("/status/:id", async (req, res) => {
  const data = await sendRequest({
    action: "status",
    order: req.params.id
  });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("GLENTECH running on port " + PORT));
