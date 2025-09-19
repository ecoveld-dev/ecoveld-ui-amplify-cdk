#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcoveldAmplifyStack } from '../lib/ecoveld-amplify-stack';

const app = new cdk.App();
new EcoveldAmplifyStack(app, 'EcoveldAmplifyStackCDK', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
