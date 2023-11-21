const responses = {};

const phoneNumbers = [];

export function getResponse(fromPhoneNumber) {
  if (!phoneNumbers.includes(fromPhoneNumber)) {
    phoneNumbers.push(fromPhoneNumber);
    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: fromPhoneNumber,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "¿Que quieres hacer?",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "button_1",
                title: "Nueva cotización",
              },
            },
            {
              type: "reply",
              reply: {
                id: "button_2",
                title: "Información de mi poliza",
              },
            },
            {
              type: "reply",
              reply: {
                id: "button_3",
                title: "Información de pago",
              },
            },
          ],
        },
      },
    };
  } else {
    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: fromPhoneNumber,
      type: "text",
      text: {
        preview_url: false,
        body: "Siguiente paso",
      },
    };
  }
}
