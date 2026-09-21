export const infraInfo: Record<string, string> = {
  vpc: 'VPC — the isolated virtual network that contains every other resource.',
  public: 'Public subnet — holds only what must face the internet, such as the load balancer.',
  private: 'Private subnet — application and database resources with no direct internet exposure.',
  alb: 'ALB — Application Load Balancer that spreads incoming traffic across EC2 and EKS targets.',
  ec2: 'EC2 — virtual servers running application workloads in the private subnet.',
  rds: 'RDS — managed relational database, reachable only from inside the VPC.',
  eks: 'EKS — managed Kubernetes control plane running containerized workloads.',
  pods: 'Pods — the smallest deployable units in Kubernetes, scheduled onto EKS worker nodes.',
  monitor: 'Monitoring — CloudWatch, Prometheus and Grafana collect metrics, logs and alerts from every layer.',
}
