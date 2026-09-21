export type FlowNode = { label: string; sub?: string }
export type Project = {
  id: string
  title: string
  tech: string[]
  flow: FlowNode[][] // each inner array is one stage of the architecture diagram
  points: string[] // overview, five points
  // Only rendered when set. Add real URLs here – never placeholders.
  github?: string
  live?: string
  view?: string
}

// NOTE: contribution/result copy is drafted strictly from the technology lists in the brief.
// Review it and make it as specific as you like.
export const projects: Project[] = [
  {
    id: 'flight',
    title: 'Cloud-Native Flight Reservation Platform',
    tech: ['Kubernetes', 'Docker', 'AWS', 'EKS', 'API Gateway', 'ConfigMaps', 'Secrets', 'Network Policies', 'HPA'],
    flow: [
      [{ label: 'USER' }],
      [{ label: 'API GATEWAY' }],
      [{ label: 'AUTH' }, { label: 'BOOKING' }, { label: 'PAYMENT' }, { label: 'NOTIFICATION' }],
      [{ label: 'KUBERNETES' }],
      [{ label: 'AWS EKS' }],
    ],
    points: [
      'A microservices-based flight reservation platform running on AWS EKS.',
      'Five services: authentication, booking, payment, notification and an API gateway.',
      'Configuration lives in ConfigMaps and Secrets, not inside container images.',
      'Network Policies limit which services can talk to each other; HPA scales pods with load.',
      'My part: the Kubernetes layer — containerizing the services and configuring these resources on EKS.',
    ],
  },
  {
    id: 'infra',
    title: 'AWS Infrastructure Automation',
    tech: ['Terraform', 'AWS', 'VPC', 'EC2', 'RDS', 'ALB', 'Security Groups'],
    flow: [
      [{ label: 'TERRAFORM' }],
      [{ label: 'VPC' }],
      [{ label: 'ALB', sub: 'public subnet' }, { label: 'EC2', sub: 'private subnet' }, { label: 'RDS', sub: 'private subnet' }],
    ],
    points: [
      'An AWS environment defined entirely as Terraform code.',
      'A VPC with public and private subnets.',
      'The ALB is the only public entry point, placed in the public subnet.',
      'EC2 and RDS sit in private subnets, protected by Security Groups.',
      'My part: writing the Terraform so the environment can be reviewed with terraform plan and recreated from code.',
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD Automation',
    tech: ['Jenkins', 'GitHub Actions', 'Docker', 'AWS', 'Kubernetes'],
    flow: [
      [{ label: 'GIT PUSH' }],
      [{ label: 'BUILD' }],
      [{ label: 'TEST' }],
      [{ label: 'DOCKER IMAGE' }],
      [{ label: 'REGISTRY' }],
      [{ label: 'DEPLOY' }],
      [{ label: 'KUBERNETES' }],
      [{ label: 'MONITORING' }],
    ],
    points: [
      'An automated path from git push to a running Kubernetes deployment.',
      'Stages: build, test, Docker image, registry, deploy.',
      'Implemented with Jenkins and GitHub Actions.',
      'The container image is the artifact that moves from build to registry to the cluster.',
      'Monitoring closes the loop after every deploy.',
    ],
  },
  {
    id: 'edublitz',
    title: '3-Tier Cloud Architecture',
    tech: ['CloudFront', 'S3', 'EC2', 'RDS MySQL', 'AWS'],
    flow: [
      [{ label: 'CLOUDFRONT' }, { label: 'S3' }],
      [{ label: 'EC2', sub: 'application' }],
      [{ label: 'RDS MYSQL', sub: 'private' }],
    ],
    points: [
      'A three-tier architecture on AWS.',
      'Edge tier: CloudFront and S3 serve the public-facing content.',
      'Application tier: EC2 runs the application logic.',
      'Database tier: a private RDS MySQL instance, not exposed to the public internet.',
      'Public/private separation makes the application tier the database\'s only path in.',
    ],
  },
]
