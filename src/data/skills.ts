export type Skill = {
  id: string
  name: string
  group: 'Cloud' | 'DevOps' | 'Observability' | 'Systems'
  desc: string
}

export const skills: Skill[] = [
  { id: 'aws', name: 'AWS', group: 'Cloud', desc: 'Cloud platform where the networking, compute, database and load-balancing layers run.' },
  { id: 'ec2', name: 'EC2', group: 'Cloud', desc: 'Virtual servers for application workloads, placed in private subnets behind a load balancer.' },
  { id: 's3', name: 'S3', group: 'Cloud', desc: 'Object storage, used for static content and served through CloudFront.' },
  { id: 'vpc', name: 'VPC', group: 'Cloud', desc: 'Isolated virtual network with public and private subnets and security groups.' },
  { id: 'iam', name: 'IAM', group: 'Cloud', desc: 'Users, roles and policies that grant least-privilege access to AWS resources.' },
  { id: 'rds', name: 'RDS', group: 'Cloud', desc: 'Managed relational database, kept in private subnets away from the public internet.' },
  { id: 'eks', name: 'EKS', group: 'Cloud', desc: 'Managed Kubernetes control plane on AWS for running containerized workloads.' },
  { id: 'alb', name: 'ALB', group: 'Cloud', desc: 'Application Load Balancer that distributes incoming traffic across targets.' },
  { id: 'asg', name: 'Auto Scaling', group: 'Cloud', desc: 'Adds or removes capacity automatically as demand changes.' },
  

  { id: 'docker', name: 'Docker', group: 'DevOps', desc: 'Packages an application and its dependencies into a portable container image.' },
  { id: 'k8s', name: 'Kubernetes', group: 'DevOps', desc: 'Container orchestration platform used to deploy, scale and manage containerized workloads.' },
  { id: 'terraform', name: 'Terraform', group: 'DevOps', desc: 'Infrastructure as code: describe cloud resources in files, review the plan, then apply.' },
  { id: 'jenkins', name: 'Jenkins', group: 'DevOps', desc: 'Automation server that runs build, test and deploy pipelines.' },
  { id: 'gha', name: 'GitHub Actions', group: 'DevOps', desc: 'Workflow automation that runs CI/CD directly from a GitHub repository.' },
  { id: 'ansible', name: 'Ansible', group: 'DevOps', desc: 'Automation and configuration management for provisioning, configuring and deploying systems.' },
  { id: 'helm', name: 'Helm', group: 'DevOps', desc: 'Kubernetes package manager used to define, version and deploy applications with reusable charts.' },
  { id: 'argocd', name: 'Argo CD', group: 'DevOps', desc: 'GitOps continuous delivery tool that synchronizes Kubernetes applications from Git repositories.' },
  { id: 'gitlab', name: 'GitLab CI/CD', group: 'DevOps', desc: 'CI/CD automation platform for building, testing and deploying applications through GitLab pipelines.' },
  { id: 'compose', name: 'Docker Compose', group: 'DevOps', desc: 'Defines and runs multi-container applications locally and across development environments.' },

  { id: 'prom', name: 'Prometheus', group: 'Observability', desc: 'Collects and stores time-series metrics from services and clusters.' },
  { id: 'grafana', name: 'Grafana', group: 'Observability', desc: 'Dashboards that turn metrics into something readable at a glance.' },
  { id: 'cw', name: 'CloudWatch', group: 'Observability', desc: 'AWS-native metrics, logs and alarms for the resources running in the account.' },
  { id: 'elk', name: 'ELK Stack', group: 'Observability', desc: 'Log aggregation and search stack used to collect, process and analyze application and infrastructure logs.' },

  { id: 'linux', name: 'Linux', group: 'Systems', desc: 'Day-to-day environment for servers, troubleshooting and shell work.' },
  { id: 'git', name: 'Git', group: 'Systems', desc: 'Version control and the starting point of every pipeline.' },
  { id: 'python', name: 'Python', group: 'Systems', desc: 'Scripting language for automation and tooling.' },
  { id: 'bash', name: 'Bash', group: 'Systems', desc: 'Shell scripting for glue code, deployment steps and server tasks.' },
]

// Relationships used for the hover highlighting.
export const edges: [string, string][] = [
  ['terraform', 'aws'], ['terraform', 'vpc'], ['terraform', 'ec2'], ['terraform', 'eks'],
  ['terraform', 'rds'], ['terraform', 'alb'], ['aws', 'vpc'], ['aws', 's3'], ['aws', 'iam'],
  ['aws', 'asg'], ['vpc', 'ec2'], ['vpc', 'rds'], ['vpc', 'alb'], ['vpc', 'eks'],
  ['alb', 'ec2'], ['alb', 'eks'], ['asg', 'ec2'], ['iam', 'eks'], ['eks', 'k8s'],
  ['k8s', 'docker'], ['docker', 'gha'], ['docker', 'jenkins'], ['git', 'gha'], ['git', 'jenkins'],['docker', 'gitlab'],['docker', 'compose'],
  ['gha', 'k8s'], ['jenkins', 'k8s'], ['prom', 'k8s'], ['prom', 'grafana'], ['cw', 'aws'],
  ['cw', 'ec2'], ['cw', 'eks'], ['cw', 'rds'], ['grafana', 'cw'], ['linux', 'ec2'],
  ['linux', 'docker'], ['bash', 'linux'], ['python', 'linux'], ['git', 'bash'],
  ['helm', 'k8s'],['argocd', 'k8s'],['argocd', 'git'],['argocd', 'gha'],['helm', 'docker'],
  ['ansible', 'terraform'],['ansible', 'aws'],['ansible', 'linux'],['ansible', 'docker'],['ansible', 'k8s'],
  ['compose', 'docker'],['compose', 'linux'],['compose', 'git'],
  ['elk', 'k8s'],['elk', 'docker'],['elk', 'linux'],['elk', 'prom'],['elk', 'grafana'],

]

export const chains: string[][] = [
  ['Terraform', 'AWS VPC', 'EC2 / EKS', 'Applications', 'Monitoring'],
  ['Git', 'GitHub Actions', 'Docker', 'Registry', 'Kubernetes'],
  ['Git', 'GitLab CI/CD', 'Docker', 'Kubernetes', 'Argo CD'],
  ['Terraform', 'Ansible', 'Linux', 'Docker', 'Kubernetes'],
  ['Docker Compose', 'Docker', 'Kubernetes', 'Helm', 'Argo CD'],
  ['Kubernetes', 'Prometheus', 'Grafana', 'ELK Stack'],
]
