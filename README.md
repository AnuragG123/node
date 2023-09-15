provider "aws" {
  region = "us-east-1"  # Replace with your desired region
}

# Define variables for the allowed IPv4 and IPv6 addresses
variable "allowed_ipv4_addresses" {
  type    = list(string)
  default = ["179.78.0.0/16", "192.168.1.0/24"]  # Add your desired IPv4 ranges here
}

variable "allowed_ipv6_addresses" {
  type    = list(string)
  default = ["2001:0db8:85a3:0000:0000:8a2e:0370:7334", "2001:0db8:0:0:0:0:0:1"]  # Add your desired IPv6 ranges here
}

resource "aws_api_gateway_rest_api" "example" {
  name        = "example-api"
  description = "Example API"
}

resource "aws_api_gateway_resource" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id
  parent_id   = aws_api_gateway_rest_api.example.root_resource_id
  path_part   = "example"
}

resource "aws_api_gateway_method" "example" {
  rest_api_id   = aws_api_gateway_rest_api.example.id
  resource_id   = aws_api_gateway_resource.example.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_stage" "example" {
  deployment_id = aws_api_gateway_deployment.example.id
  rest_api_id   = aws_api_gateway_rest_api.example.id
  stage_name    = "example"
}

resource "aws_api_gateway_deployment" "example" {
  depends_on = [aws_api_gateway_method.example]

  rest_api_id = aws_api_gateway_rest_api.example.id
  description = "example deployment"
}

resource "aws_api_gateway_usage_plan" "example" {
  name = "example-usage-plan"
  description = "Example Usage Plan"
  product_code = "EXAMPLE"

  quota_settings {
    limit = 5000
    offset = 2
    period = "MONTH"
  }
}

resource "aws_api_gateway_api_key" "example" {
  name = "example-api-key"
}

resource "aws_api_gateway_usage_plan_key" "example" {
  key_id        = aws_api_gateway_api_key.example.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.example.id
}

resource "aws_api_gateway_method_settings" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id
  stage_name  = aws_api_gateway_stage.example.stage_name
  method_path = aws_api_gateway_resource.example.path

  settings {
    # Customize any other settings as needed
  }
}

# Create an IP whitelist for IPv4 addresses
resource "aws_api_gateway_usage_plan_ip_whitelist" "example_ipv4" {
  usage_plan_id = aws_api_gateway_usage_plan.example.id
  ip_ranges     = var.allowed_ipv4_addresses
}

# Create an IP whitelist for IPv6 addresses
resource "aws_api_gateway_usage_plan_ip_whitelist" "example_ipv6" {
  usage_plan_id = aws_api_gateway_usage_plan.example.id
  ip_ranges     = var.allowed_ipv6_addresses
}
