import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from 'aws-cdk-lib/aws-amplify';

export class EcoveldAmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = 'https://github.com/ecoveld-dev/ecoveld-ui';
    const githubTokenName = 'ecoveld-ui-github-pat';

    const amplifyYml = `
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    `;

    const envVars: amplify.CfnApp.EnvironmentVariableProperty[] = [
      { name: 'NEXT_PUBLIC_API_BASE', value: 'https://99tenhsttd.execute-api.us-west-2.amazonaws.com' },
      { name: 'NEXT_PUBLIC_DATALAKE_BUCKET', value: 'ecoveld-core-dev-datalakebucket0256ea8e-zop32lbh7svs' },
      { name: 'NEXT_PUBLIC_STAGE', value: 'dev' }
    ];

    const app = new amplify.CfnApp(this, 'AmplifyApp', {
      name: 'ecoveld-ui',
      repository,
      oauthToken: cdk.SecretValue.secretsManager(githubTokenName).unsafeUnwrap(),
      buildSpec: amplifyYml,
      environmentVariables: envVars
    });

    const mainBranch = new amplify.CfnBranch(this, 'AmplifyMainBranch', {
      appId: app.attrAppId,
      branchName: 'main',
      enableAutoBuild: true,
      stage: 'PRODUCTION',
      framework: 'Next.js - SSR',
      environmentVariables: envVars
    });
    mainBranch.addDependency(app);

    new cdk.CfnOutput(this, 'AmplifyAppId', { value: app.attrAppId });
    new cdk.CfnOutput(this, 'AmplifyDefaultDomain', { value: app.attrDefaultDomain });
    new cdk.CfnOutput(this, 'AmplifyMainBranchUrl', {
      value: `https://${mainBranch.branchName}.${app.attrDefaultDomain}`
    });
  }
}