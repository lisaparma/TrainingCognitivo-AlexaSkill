const Alexa = require('ask-sdk-core');
const dbHelper = require('./databaseHelper');

const { HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler, IntentReflectorHandler,ErrorHandler } = require('./handlers/standard.js');
const { FirstLaunchRequestHandler, NameRequestHandler } = require('./handlers/meeting.js');

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
      const userId = handlerInput.requestEnvelope.context.System.user.userId;

      await dbHelper.getUserData(userId)
        .then((data) => {
          if (data.Item.user) {
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            sessionAttributes.userId = data.Item.user;
            sessionAttributes.name = data.Item.name;
            attributesManager.setSessionAttributes(sessionAttributes);
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
