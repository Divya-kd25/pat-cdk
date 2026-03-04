import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { LambdaStage } from './lambda-stage';

export interface PipelineStackProps extends cdk.StackProps {
  /** GitHub repo in owner/repo format */
  readonly repo: string;
  /** Branch that triggers this pipeline (e.g. develop, qa, main) */
  readonly branch: string;
  /** Environment name for the deploy stage (e.g. Dev, QA, Prod) */
  readonly envName: string;
  /** CDK stack id of this pipeline stack (used in synth command, e.g. DevPipelineStack) */
  readonly pipelineStackId: string;
  /** ARN of the CodeStar/CodeConnections GitHub connection */
  readonly connectionArn: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const {
      repo,
      branch,
      envName,
      pipelineStackId,
      connectionArn,
      env,
    } = props;

    const source = pipelines.CodePipelineSource.connection(repo, branch, {
      connectionArn,
      triggerOnPush: true,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: `pat-${envName.toLowerCase()}-pipeline`,
      synth: new pipelines.ShellStep('Synth', {
        input: source,
        commands: [
          `npm ci && npx cdk synth ${pipelineStackId}`,
        ],
        primaryOutputDirectory: 'cdk.out',
      }),
      selfMutation: true,
      crossAccountKeys: false,
    });

    pipeline.addStage(
      new LambdaStage(this, envName, {
        envName,
        env,
      })
    );
  }
}
