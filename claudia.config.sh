# AWS config
mkdir -p ~/.aws

cat << EOF > ~/.aws/credentials
[default]
aws_access_key_id = a${AWS_ACCESS_KEY_ID}
aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}
EOF

cat << EOF > ~/.aws/config
[default]
region = ${AWS_DEFAULT_REGION}
output = ${AWS_DEFAULT_OUTPUT}
EOF


# Lambda environment config
cat << EOF > config/environment.json
{
  "DEBUG": "${DEBUG}",
  "ENVIRONMENT": "${ENVIRONMENT}",
  "DYNAMODB_TABLE_NAME": "${DYNAMODB_TABLE_NAME}"
}
EOF
