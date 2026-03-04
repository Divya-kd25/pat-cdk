import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface LambdaStackProps extends cdk.StackProps {
  readonly envName: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { envName } = props;

    new lambda.Function(this, 'TestHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  const envName = process.env.ENV_NAME || 'unknown';
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from ' + envName }),
  };
};
      `),
      environment: {
        ENV_NAME: envName,
      },
      description: `PAT test Lambda for ${envName} environment`,
    });
  }
}
