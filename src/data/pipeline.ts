export const pipeline = [
  { id: 'dev', name: 'DEVELOPER', desc: 'Writes application and infrastructure code, then pushes changes to version control.' },
  { id: 'git', name: 'GIT', desc: 'Version control records every change and triggers the automated pipeline.' },
  { id: 'cicd', name: 'CI/CD', desc: 'Jenkins and GitHub Actions workflows build, test and prepare each change for release.' },
  { id: 'docker', name: 'DOCKER', desc: 'Packages the application and its dependencies into a portable container image.' },
  { id: 'k8s', name: 'KUBERNETES', desc: 'Container orchestration platform used to deploy, scale and manage containerized workloads.' },
  { id: 'aws', name: 'AWS', desc: 'Cloud platform providing networking, compute, databases and load balancing underneath the cluster.' },
  { id: 'mon', name: 'MONITORING', desc: 'Prometheus, Grafana and CloudWatch track metrics, logs and alerts once a release is live.' },
]
