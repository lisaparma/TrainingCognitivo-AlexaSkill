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

    // Add session attribute
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes() || {};
    sessionAttributes.name = name;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    // Save name on DynamoDB
    let speechText = "not set;"
    await dbHelper.addUser(name)
      .then((data) => {
        console.log('ok');
        speechText = `Salvato`;
      })
      .catch((err) => {
        console.log(err);
        speechText = "Errore nel salvataggio";
      });
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

module.exports = {FirstLaunchRequestHandler, NameRequestHandler};