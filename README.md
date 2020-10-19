# Contract Events Monitoring

Enter Ethereum smart contract addresses and ABIs, and enter email addresses to receive emitted Events.

![](./docs/events-monitoring-lambda.png)

### UI 
deployed at: http://oz-contract-event-monitoring-svelte-ui.s3-website.us-east-2.amazonaws.com

---

### Serverless

This project uses the [serverless](https://www.serverless.com/) framework.

Plugins used:
- [serverless-plugin-typescript](https://github.com/prisma-labs/serverless-plugin-typescript) 
- [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack)
- [serverless-s3-sync](https://github.com/k1LoW/serverless-s3-sync)
- [serverless-offline](https://github.com/dherault/serverless-offline)
- [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local)

---

### Todo

email:
- [x] set up SES
- [x] test send
- [x] debug error with fs.readFileSync
- [x] remove sandbox - waiting on AWS, case ID [7478286451](https://console.aws.amazon.com/support/home?#/case/?displayId=7478286451&language=en)


UI:
- [x] create all components
- [x] connect to APIs
  
lambdas:
- [x] run locally
- [x] deploy using serverless
- [x] get contracts for testing - use popular tokens or defi projects
- [x] test getting events from contracts
