import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as patterns from '@aws-cdk/aws-ecs-patterns';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as iam from '@aws-cdk/aws-iam'

export class StageFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'services', {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, 'StageAPICluster', {
      vpc: vpc,
    })

    const creds = secretsmanager.Secret.fromSecretArn(
      this,
      'GithubContainerRegistryCreds',
      'arn:aws:secretsmanager:us-east-1:417040426478:secret:GithubContainerRegistry-DnLoPA'
    )

    const role = new iam.Role(this, 'ServiceTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
    })

    creds.grantRead(role)

    new patterns.ApplicationLoadBalancedFargateService(this, 'StageAPIService', {
      cluster: cluster,
      cpu: 256,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('ghcr.io/ltamrazov/testingactions:latest', {
          credentials: creds,
        }),
        executionRole: role,
        containerPort: 3000,
        containerName: 'api',
      },
      memoryLimitMiB: 1024,
      publicLoadBalancer: true,
    })
  }
}
