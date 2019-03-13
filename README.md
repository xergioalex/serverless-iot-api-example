# XergioAleX Twitter Bot
---

This script allow test DailyBot bot availability.


## Docker

#### Prerequirements

Download && install **docker**
- [For Mac](https://download.docker.com/mac/stable/Docker.dmg)
- [For Windows](https://download.docker.com/win/stable/InstallDocker.msi)
- [For Linux](https://docs.docker.com/engine/getstarted/step_one/#docker-for-linux)

Download && install **docker-compose**
- [Instructions](https://docs.docker.com/compose/install/)

Download && install **docker-machine**
- [Instructions](https://docs.docker.com/machine/install-machine/)


#### Happy path for `local` environment

Just run:
```
cd docker/local
bash docker.sh up
```

The docker configuration is explained in detail below.

#### Script bash and env vars

There are serveral files with environment variables or config files to consider:

- `docker/local/.env` # Environment variables needed to run the bash script
- `docker/local/claudia/.env` # Claudia service environment variables

Files with environment variables `.env` and other config files mentioned below are ignored and will be created automatically from the `*.example` files.

#### Commands

**Notes:**

- Params between {} are optional, except {}*.
- `{command}` available: build|build:watch|create|update|test|schedule|destroy*.
- Service names available: `claudia`

The following describes each of the parameters::

**Usage: docker.sh [{command}|deploy|help]**

* `{command}` --> Run services with command script
* `deploy` --> Build && deploy lambda
* `help` --> Show menu options



---

# ------------ STEPS FOR PRODUCTION ONLY ------------

### 1. Setup environtment vars

Based on examples, create follow env files:

- `docker/local/.env`
- `docker/local/claudia/.env` // This is the most important configuration file to run every command

Update default values and complete empty ones.

**Note:** We recommend update all `local` prefix names with your username or identifier.

Follow nexts steps to complete all empty var values.

### 2. Create IAM user

- Go to IAM: https://console.aws.amazon.com/iam/home?region=us-east-1#/users
- Recommended name: `{your_username_or_identifier}`_dailybot_rover_serverless
- Create user with existing policies
  - AWSLambdaFullAccess
  - AmazonDynamoDBFullAccess
  - IAMFullAccess
  - AmazonS3FullAccess

- Search the custom policy called -> `custom_ApiGatewayFullAccess` . If not found, created a new one following next step.
- Create and add a custom policy for api gateway with name `custom_ApiGatewayFullAccess`

```
custom_ApiGatewayFullAccess

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "apigateway:*"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

Get **AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**, then fill those at: `docker/local/claudia/.env`


### 3. Create and deploy lambda function

Check claudia documentation: https://claudiajs.com/documentation.html

Update **LAMBDA_NAME** at: `docker/local/claudia/.env`

Then just run following commands:
```
cd docker/local
bash docker.sh build
bash docker.sh create
```

**Notes:**

- You can update your lambda using: `bash docker.sh update`
- You can delete your lambda using: `bash docker.sh destroy`

Output example
```
{
  "lambda": {
    "role": "xergioalex-twitter-bot-executor",
    "name": "xergioalex-twitter-bot",
    "region": "us-east-1"
  },
  "api": {
    "id": "oixvsfw0sh",
    "module": "dist/main",
    "url": "https://oixvsfw0sh.execute-api.us-east-1.amazonaws.com/latest"
  }
}
```

### 4. Schedule lambda events

Then just run following commands:
```
cd docker/local
bash docker.sh schedule
```


### 5. Invoke Lambda

You can invoke your lambda from local using claudia cli:
```
cd docker/local
bash docker.sh invoke
```

### 6. Test Lambda code

Using mocha you can test your code:
```
cd docker/local
bash docker.sh test
```

