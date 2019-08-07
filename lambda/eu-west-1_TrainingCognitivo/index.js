const Alexa = require('ask-sdk-core');
// const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

const { HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler, IntentReflectorHandler,ErrorHandler } = require('./handlers/standard.js');
const { FirstLaunchRequestHandler, NameRequestHandler } = require('./handlers/meeting.js');

// const LaunchRequestHandler = {
//   canHandle(handlerInput) {
//     const attributesManager = handlerInput.attributesManager;
//     const sessionAttributes = attributesManager.getSessionAttributes() || {};
//     const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;
//
//     return handlerInput.requestEnvelope.request.type === 'LaunchRequest' && name;
//   },
//   handle(handlerInput) {
//     const attributesManager = handlerInput.attributesManager;
//     const sessionAttributes = attributesManager.getSessionAttributes() || {};
//     const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;
//
//     const speechText = `Ciao ${name}!`;
//     return handlerInput.responseBuilder
//       .speak(speechText)
//       //.reprompt(speechText)
//       .getResponse();
//   }
// };


// const LoadNameInterceptor = {
  // async process(handlerInput) {
  //   const attributesManager = handlerInput.attributesManager;
  //   const sessionAttributes = await attributesManager.getPersistentAttributes() || {};
  //
  //   const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;
  //
  //   if (name) {
  //     attributesManager.setSessionAttributes(sessionAttributes);
  //   }
  // }
// };

exports.handler = Alexa.SkillBuilders.custom()
  // .withPersistenceAdapter(
  //   new persistenceAdapter.S3PersistenceAdapter({bucketName:"ciao"}))
  .addRequestHandlers(
    // LaunchRequestHandler,
    FirstLaunchRequestHandler,
    NameRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler)
  // .addRequestInterceptors(
  //   LoadNameInterceptor)
  .addErrorHandlers(
    ErrorHandler)
  .lambda();
