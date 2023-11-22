import { MESSAGE_TYPES, INTERACTIVE_TYPES } from "./constants.js";

const responses = {
  [INTERACTIVE_TYPES.BUTTON_REPLY]: {
    language_button_en: (from) => ({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "text",
      text: {
        preview_url: false,
        body: "Please, indicate your name",
      },
    }),
    language_button_es: (from) => ({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "text",
      text: {
        preview_url: false,
        body: "Por favor, indicar su nombre y apellido",
      },
    }),
  },
};

const phoneNumbers = [];

export function getResponse(body) {
  const from = body.entry[0].changes[0].value.messages[0].from;
  const messageType = body.entry[0].changes[0].value.messages[0].type;

  if (!phoneNumbers.includes(from)) {
    phoneNumbers.push(from);
    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Hi! I'm your virtual assistant. Please, select your language:",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "language_button_en",
                title: "English",
              },
            },
            {
              type: "reply",
              reply: {
                id: "language_button_es",
                title: "Spanish",
              },
            },
          ],
        },
      },
    };
  } else {
    if (messageType === MESSAGE_TYPES.INTERACTIVE) {
      const interactiveType = getInteractiveType(body);
      const buttonId = getButtonReplyId(body);
      const response = responses[interactiveType][buttonId](from);
      return response;
    }

    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "text",
      text: {
        preview_url: false,
        body: "Por implementar",
      },
    };
  }
}

function getInteractiveType(body) {
  const messageType = body.entry[0].changes[0].value.messages[0].type;
  if (messageType === MESSAGE_TYPES.INTERACTIVE) {
    const interactiveType =
      body.entry[0].changes[0].value.messages[0].interactive.type;
    return interactiveType;
  }
}

function getButtonReplyId(body) {
  const buttonId =
    body.entry[0].changes[0].value.messages[0].interactive.action.button_reply
      .id;
  return buttonId;
}
