const responses = {};

const phoneNumbers = [];

export function getResponse(body) {
  let fromPhoneNumber = body.entry[0].changes[0].value.messages[0].from;
  if (!phoneNumbers.includes(fromPhoneNumber)) {
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
            {
              type: "reply",
              reply: {
                id: "button_4",
                title: "Hacer un pago",
              },
            },
            {
              type: "reply",
              reply: {
                id: "button_5",
                title: "Realizar cambios",
              },
            },
            {
              type: "reply",
              reply: {
                id: "button_6",
                title: "Otros",
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
