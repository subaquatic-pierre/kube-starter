[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/subaquatic-pierre/kube-starter.svg)](https://github.com/subaquatic-pierre/kube-starter/issues)
[![GitHub stars](https://img.shields.io/github/stars/subaquatic-pierre/kube-starter.svg)](https://github.com/subaquatic-pierre/kube-starter/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/subaquatic-pierre/kube-starter.svg)](https://github.com/subaquatic-pierre/kube-starter/network)

# Kube Starter

![Kube Starter Logo](.github/logo.png)

## Project Overview

Kube Starter is an all-encompassing starter project designed to establish a solid foundation for deploying scalable, containerized applications using Kubernetes on AWS. The project integrates critical components such as NGINX as a load balancer, Kubernetes templates, Terraform scripts for AWS infrastructure deployment, a Python API for authentication, a Next.js frontend for user login, and a default admin page. Additionally, MongoDB is used for data storage, and Docker Compose facilitates local development.
Table of Contents

## Table of Contents

- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Local Development](#local-development)
  - [Deployment to AWS](#deployment-to-aws)
- [API Documentation](#api-documentation)
- [Frontend](#frontend)
- [Infastructure](#infrastructure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Key Features

- **NGINX Load Balancer:** Efficiently distributes traffic to ensure optimal performance.
- **Kubernetes Templates:** Ready-to-use templates for seamless deployment and scaling.
- **Terraform Infrastructure:** Simplifies AWS infrastructure setup and management.
- **Python API for Authentication:** Robust authentication handling for secure access.
- **Next.js Frontend:** User-friendly interface with login and default admin page.
- **MongoDB Data Storage:** Scalable and flexible data storage solution.
- **Docker Compose for Local Development:** Simplifies local development environment setup.

## Getting Started

### Prerequisites

To get started with Kube Starter, make sure you have the following installed:

- Docker
- Kubernetes
- Terraform
- Python v3.10
- NodeJS v18

### Installation

Clone the repository:

```sh
git clone https://github.com/subaquatic-pierre/kube-starter
cd kube-starter
```

## Project Structure

- api: Python API for authentication.
- config: NGINX and project configuration files.
- data: MongoDB mount point for data storage.
- kubernetes: Kubernetes templates for deployment.
- scripts: Scripts for Docker image build, deployment, and remote commands for production Kubernetes updates.
- terraform: Terraform templates for AWS infrastructure.
- www: Next.js frontend/dashboard.

# Configuration

Kube Starter allows for flexible configuration. Edit the configuration files in the config directory to customize NGINX settings, Kubernetes templates, and more.

## Usage

### Local Development

Run Docker Compose:

```sh
docker-compose up
```

This command will set up the development environment with all necessary services.

#### Access Frontend:

Open your browser and navigate to http://localhost:3000 to access the Next.js frontend.

### Deployment to AWS

Follow these steps to deploy Kube Starter to AWS:

Configure AWS Credentials:

#### Set up your AWS credentials

export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key

#### Deploy Infrastructure with Terraform:

```sh
cd terraform
terraform init
terraform apply
```

## API Documentation

The Python API handles authentication. Refer to the API documentation in the api directory for details on authentication methods and usage.
Frontend

## Frontend

The Next.js frontend provides a user-friendly interface for login and includes a default admin page. Explore the www directory for more details on frontend features.

## Infrastructure

The project's infrastructure is designed to be scalable, efficient, and easily deployable on AWS using Terraform. Below are key components of the infrastructure:

- **NGINX Load Balancer:** Handles incoming traffic and distributes it across the application instances.
- **AWS Resources:** Utilizes Terraform scripts to provision and manage AWS resources, ensuring a reliable and scalable infrastructure.
- **Kubernetes Deployment:** Leverages Kubernetes for container orchestration, allowing for easy scaling and management of application containers.
- **MongoDB Data Storage:** Provides a robust and scalable data storage solution for the application.

### Deployment Workflow

1. **Local Development:**

   - Docker Compose is used for local development, allowing developers to work in an environment that mirrors the production setup.

2. **AWS Deployment:**

   - Terraform scripts in the `terraform` directory define the AWS infrastructure.
   - Kubernetes templates in the `kubernetes` directory define the deployment configurations.

3. **Scalability:**
   - The Kubernetes deployment allows for easy scaling of application instances to handle varying workloads.

## Contributing

We welcome contributions! Follow our Contribution Guidelines for detailed information on how to contribute to Kube Starter.

## Roadmap

Our future plans include:

- Integration of additional authentication providers.
- Enhanced scalability features for Kubernetes deployment.
- Improved logging and monitoring capabilities.

## License

This project is licensed under the [MIT License](LICENSE).
