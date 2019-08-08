const Alexa = require('ask-sdk-core');
// const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

const { HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler, IntentReflectorHandler,ErrorHandler } = require('./handlers/standard.js');
const { FirstLaunchRequestHandler, NameRequestHandler } = require('./handlers/meeting.js');

const dbHelper = require('./databaseHelper');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;

    return handlerInput.requestEnvelope.request.type === 'LaunchRequest' && name;
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;

    const speechText = `Ciao ${name}!`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};


const LoadNameInterceptor = {
  async process(handlerInput) {
    if (handlerInput.requestEnvelope.request.type === 'LaunchRequest') {
      const attributesManager = handlerInput.attributesManager;

      await dbHelper.getUserData("lisa")
        .then((data) => {
          console.log(data);
          if (data.Item.user) {
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.name = data.Item.user;
            attributesManager.setSessionAttributes(sessionAttributes);
            console.log(sessionAttributes);
          }
        })
        .catch((err) => {
          console.log(err);

        });
    }
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    FirstLaunchRequestHandler,
    NameRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler)
  .addRequestInterceptors(
    LoadNameInterceptor)
  .addErrorHandlers(
    ErrorHandler)
  .lambda();
