import { MESSAGE_TYPES, INTERACTIVE_TYPES } from "./constants.js";

const phoneNumbers = [];

const responses = {
  [INTERACTIVE_TYPES.BUTTON_REPLY]: {
    language_button_en: (from) => {
      const index = phoneNumbers.findIndex(
        (phoneNumber) => phoneNumber.from === from
      );
      // Add id to distingue the type of text reply
      phoneNumbers[index].textReplyId = "get_name_en";

      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "text",
        text: {
          preview_url: false,
          body: "Please, indicate your name",
        },
      };
    },
    language_button_es: (from) => {
      const index = phoneNumbers.findIndex(
        (phoneNumber) => phoneNumber.from === from
      );
      // Add id to distingue the type of text reply
      phoneNumbers[index].textReplyId = "get_name_es";

      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "text",
        text: {
          preview_url: false,
          body: "Por favor, indicar su nombre y apellido",
        },
      };
    },
  },
  [MESSAGE_TYPES.TEXT]: {
    get_name_en: (body) => {
      const from = body.entry[0].changes[0].value.messages[0].from;
      const name = body.entry[0].changes[0].value.messages[0].text.body;
      const index = phoneNumbers.findIndex(
        (phoneNumber) => phoneNumber.from === from
      );
      // Add name
      phoneNumbers[index].name = name;

      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: `Hello ${name}!`,
          },
          body: {
            text: "Open the menu to see how I can help you.",
          },
          action: {
            button: "View options",
            sections: [
              {
                title: "Select one field",
                rows: [
                  {
                    id: "new_quotation_en",
                    title: "New quotation",
                    description:
                      "You can get a new quotation on any of our services",
                  },
                  {
                    id: "policy_information_en",
                    title: "Policy information",
                    description: "You can obtain your policy information",
                  },
                  {
                    id: "payment_information_en",
                    title: "Payment information",
                    description: "You can obtain our payments methods",
                  },
                  {
                    id: "make_payment_en",
                    title: "Make a payment",
                    description: "You can make a payment of your services",
                  },
                  {
                    id: "make_changes_en",
                    title: "Make changes",
                    description: "You can update your information",
                  },
                ],
              },
            ],
          },
        },
      };
    },
    get_name_es: (body) => {
      const from = body.entry[0].changes[0].value.messages[0].from;
      const name = body.entry[0].changes[0].value.messages[0].text.body;
      const index = phoneNumbers.findIndex(
        (phoneNumber) => phoneNumber.from === from
      );
      // Add name
      phoneNumbers[index].name = name;

      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: `Hola ${name}!`,
          },
          body: {
            text: "Abre el menú para ver las opciones en las que te puedo ayudar.",
          },
          action: {
            button: "Ver opciones",
            sections: [
              {
                title: "Seleccione un campo",
                rows: [
                  {
                    id: "new_quotation_es",
                    title: "Nueva cotización",
                    description:
                      "Puede obtener un nuevo presupuesto para cualquiera de nuestros servicios",
                  },
                  {
                    id: "policy_information_es",
                    title: "Información de póliza",
                    description: "Puede obtener información sobre su póliza",
                  },
                  {
                    id: "payment_information_es",
                    title: "Información de pago",
                    description: "Puede obtener nuestros métodos de pago",
                  },
                  {
                    id: "make_payment_es",
                    title: "Hacer un pago",
                    description: "Puede realizar el pago de sus servicios",
                  },
                  {
                    id: "make_changes_es",
                    title: "Hacer cambios",
                    description: "Puede actualizar su información",
                  },
                ],
              },
            ],
          },
        },
      };
    },
  },
};

export function getResponse(body) {
  const from = body.entry[0].changes[0].value.messages[0].from;
  const messageType = body.entry[0].changes[0].value.messages[0].type;

  if (!phoneNumbers.find((phoneNumber) => phoneNumber.from === from)) {
    phoneNumbers.push({ from });
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
      if (interactiveType === INTERACTIVE_TYPES.BUTTON_REPLY) {
        const buttonId = getButtonReplyId(body);
        const response = responses[interactiveType][buttonId](from);
        return response;
      }
    }

    if (messageType === MESSAGE_TYPES.TEXT) {
      const textReplyId = getTextReplyId(from, phoneNumbers);
      const response = responses[messageType][textReplyId](body);
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
    body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
  return buttonId;
}

function getTextReplyId(from, numbers) {
  const index = numbers.findIndex((number) => number.from === from);
  return numbers[index].textReplyId;
}

export function getIncomingRequestType(body) {
  const value = body.entry[0].changes[0].value;
  if (value.hasOwnProperty("messages")) return "message";
  if (value.hasOwnProperty("statuses")) return "status";
  return "other";
}
