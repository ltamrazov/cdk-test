#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StageFargateStack } from '../lib/stage-fargate-stack';

const app = new cdk.App();
new StageFargateStack(app, 'stage-fargate', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    }
});
