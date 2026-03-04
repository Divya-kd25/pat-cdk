import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from './lambda-stack';

export interface LambdaStageProps extends cdk.StageProps {
  readonly envName: string;
}

export class LambdaStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: LambdaStageProps) {
    super(scope, id, props);

    const { envName } = props;

    new LambdaStack(this, `LambdaStack-${envName}`, {
      envName,
      env: props.env,
      description: `PAT Lambda stack for ${envName}`,
    });
  }
}
