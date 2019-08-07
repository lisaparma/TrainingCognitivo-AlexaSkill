const dbHelper = require('../databaseHelper');

const FirstLaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Ciao! Come ti chiami?';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const NameRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'NameIntent';
  },
  async handle(handlerInput) {
    const name = handlerInput.requestEnvelope.request.intent.slots.name.value;
    // const attributesManager = handlerInput.attributesManager;
    // const nameAttribute = {
    //   "name": name,
    // };
    // attributesManager.setPersistentAttributes(nameAttribute);
    // await attributesManager.savePersistentAttributes();

    dbHelper.addUser(name)
      .then((data) => {
        console.log(data);
        const speechText = `Salvato`;
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
      .catch((err) => {
        console.log(err);
        const speechText = "Errore nel salvataggio";
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      });
  }
};

module.exports = {FirstLaunchRequestHandler, NameRequestHandler};