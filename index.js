import express from "express";
import axios from "axios";
import { getResponse, getIncomingRequestType } from "./messageHandler.js";

const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const app = express().use(express.json());

app.listen(PORT, () => {
  console.log("Server online: Listening to webhook");
});

app.post("/webhook", async (req, res) => {
  const body = req.body;
  const incomingRequestType = getIncomingRequestType(body);

  console.log("Incoming request...", incomingRequestType);
  console.log("Message", JSON.stringify(body.entry[0].changes[0].value));

  // Block statuses request to generate message response
  if (incomingRequestType !== "message") return res.sendStatus(200);

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const phone_number_id =
        body.entry[0].changes[0].value.metadata.phone_number_id;
      const response = getResponse(body);

      try {
        await axios.post(
          "https://graph.facebook.com/v17.0/" + phone_number_id + "/messages",
          response,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + WHATSAPP_TOKEN,
            },
          }
        );
        console.log("Message sent");
      } catch (error) {
        console.error(error.response.data);
      }
    }
    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
