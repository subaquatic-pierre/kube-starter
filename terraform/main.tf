terraform {
  required_providers {
   aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# terraform {
#   backend "s3" {
#     bucket = "terraform-backend"
#     key    = "tfstate/terraform-backend"
#     region = "us-east-1"
#   }
# }

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name            = "${var.tags["Project"]}-vpc"
  cidr            = var.vpc_cidr
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  tags            = var.tags

  # Enable public access to DB
  create_database_subnet_group           = true
  create_database_subnet_route_table     = true
  create_database_internet_gateway_route = true

  enable_dns_hostnames = true
  enable_dns_support   = true
}

# module "frontend" {
#   source = "./www"

#   prefix       = "${var.tags["Project"]}-www"
#   domain_name  = var.domain_name
#   ssl_cert_arn = var.ssl_cert_arn
#   tags         = var.tags
# }

# module "pipelines" {
#   source = "./pipelines"

#   aws_account_id       = var.aws_account_id
#   tags                 = var.tags
#   github_account       = var.github_account
#   api_ecr_repo_url     = var.api_ecr_app_uri
#   frontend_github_repo = var.frontend_github_repo
#   api_github_repo      = var.api_github_repo
#   build_secrets        = var.build_secrets

#   subnet_ids               = module.vpc.public_subnets
#   frontend_site_bucket     = module.frontend.bucket_main
#   frontend_cf_distribution = module.frontend.cf_distribution_id_main
# }

# module "api" {
#   source = "./api"

#   domain_name = var.domain_name
#   prefix      = "${var.tags["Project"]}-api"
#   tags        = var.tags

#   vpc_cidr           = var.vpc_cidr
#   vpc_id             = module.vpc.vpc_id
#   subnet_ids         = module.vpc.public_subnets
#   public_subnets     = var.public_subnet_cidrs
#   availability_zones = var.availability_zones

#   ssl_cert_arn = var.ssl_cert_arn
#   ecr_app_uri  = var.api_ecr_app_uri
# }


