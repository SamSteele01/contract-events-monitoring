import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'contract-events-monitoring',
    // app and org for use with dashboard.serverless.com
    // app: 'contract-events-monitoring'
    // org: your-org-name,
  },
  frameworkVersion: '2',
  configValidationMode: 'error',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    s3Sync: {
      bucketName: 'notSure',
      localDir: 'ui/build'
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-s3-sync'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    profile: 'oz-sam-test',
    region: 'us-east-2',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    listContracts: {
      handler: 'lambdas/listContracts.listContracts',
      events: [
        {
          http: {
            method: 'get',
            path: 'list-contracts',
          }
        }
      ]
    }
    // ...CRUD-contracts
    // ...CRUD-emails
  },
  resources: {
    Resources: {
      SvelteUIBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          AccessControl: 'PublicRead',
          BucketName: 'oz-code-challenge-svelte-ui',
          WebsiteConfiguration: {
            IndexDocument: 'index.html',
          }
        }
      }
      // api gateway
      // dynamoDb
      // SES
    }
  }
}

module.exports = serverlessConfiguration;
