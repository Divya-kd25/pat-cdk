#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const connectionArn =
  app.node.tryGetContext('githubConnectionArn') ||
  process.env.GITHUB_CONNECTION_ARN ||
  '';

const githubRepo =
  app.node.tryGetContext('githubRepo') ||
  process.env.GITHUB_REPO ||
  'owner/repo';

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

if (!connectionArn) {
  console.warn(
    'Warning: githubConnectionArn not set. Set it in cdk.json context or GITHUB_CONNECTION_ARN env var before deploying pipelines.'
  );
}

new PipelineStack(app, 'DevPipelineStack', {
  repo: githubRepo,
  branch: 'develop',
  envName: 'Dev',
  pipelineStackId: 'DevPipelineStack',
  connectionArn,
  env,
  description: 'PAT Dev pipeline (source: develop)',
});

new PipelineStack(app, 'QAPipelineStack', {
  repo: githubRepo,
  branch: 'qa',
  envName: 'QA',
  pipelineStackId: 'QAPipelineStack',
  connectionArn,
  env,
  description: 'PAT QA pipeline (source: qa)',
});

new PipelineStack(app, 'ProdPipelineStack', {
  repo: githubRepo,
  branch: 'main',
  envName: 'Prod',
  pipelineStackId: 'ProdPipelineStack',
  connectionArn,
  env,
  description: 'PAT Prod pipeline (source: main)',
});
