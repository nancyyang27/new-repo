import Auth from '@aws-amplify/auth';
import Lambda from 'aws-sdk/clients/lambda'; // npm install aws-sdk




function CallLambda({ funcName, payload }){
    let rtn = Auth.currentCredentials()
    .then(credentials => {
      const lambda = new Lambda({
        credentials: Auth.essentialCredentials(credentials)
      });
      let result = lambda.invoke({
        "FunctionName": funcName,
        "Payload": JSON.stringify(payload),
      });
      console.log(result);
      return result
    });
    return rtn
}

export default CallLambda