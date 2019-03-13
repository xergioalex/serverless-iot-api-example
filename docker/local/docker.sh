#!/bin/bash

# Utils functions
. ./../utils.sh

# Create envs vars if don't exist
ENV_FILES=(".env" "claudia/.env")
utils.check_envs_files "${ENV_FILES[@]}"

# Load environment vars, to use from console, run follow command:
utils.load_environment
utils.load_environment_permissions

# Set default value
export YARN_COMMAND="run build"


# Menu options
if [[ "$1" == "up" ]]; then
    export YARN_COMMAND="run build:watch"
    docker-compose build claudia
    docker-compose up -d claudia
    docker-compose up -d claudia_api dynamodb
    # Create dynamo tables
    export YARN_COMMAND="run dynamodb:local:list"
    DYNAMODB_TABLES_LIST=$(docker-compose up claudia_cmd)
    if [[ -z $(echo $DYNAMODB_TABLES_LIST | grep "xergioalex-iot-api") ]]; then
        export YARN_COMMAND="run dynamodb:local:create"
        docker-compose up claudia_cmd
    fi
    if [[ -z $(echo $DYNAMODB_TABLES_LIST | grep "test") ]]; then
        export YARN_COMMAND="run dynamodb:local:create:test"
        docker-compose up claudia_cmd
    fi
    # Watch api changes
    cd ../..
    npm run local:api:watch
elif [[ "$1" == "up" ]]; then
    export YARN_COMMAND="run build:watch"
    docker-compose build claudia
    docker-compose up -d claudia
    docker-compose up -d claudia_api
    cd ../..
    npm run local:api:watch
elif [[ "$1" == "local:api:watch" ]]; then
    cd ../..
    npm run local:api:watch
elif [[ "$1" == "deploy" ]]; then
    utils.printer "Build lambda"
    export YARN_COMMAND="run build"
    docker-compose build claudia_cmd
    docker-compose up claudia_cmd
    if [[ ! -f "../../claudia.json" ]]; then
        export YARN_COMMAND="run create"
    else
        export YARN_COMMAND="run update"
    fi
    utils.printer "Deploy lambda"
    docker-compose up claudia_cmd
elif [[ "$1" == "add" ]]; then
    if [[ "$3" == "dev" ]]; then
        export YARN_COMMAND="install --save $2 --save-dev"
    else
        export YARN_COMMAND="install --save $2"
    fi
    utils.printer "Run command"
    docker-compose build claudia_cmd
    docker-compose up claudia_cmd
elif [[ "$1" == "ps" ]]; then
    utils.printer "Show all running containers"
    docker-compose ps
elif [[ "$1" == "restart" ]]; then
    utils.printer "Restart services"
    docker-compose restart $2
elif [[ "$1" == "stop" ]]; then
    utils.printer "Stop services"
    docker-compose stop $2
elif [[ "$1" == "rm" ]]; then
    utils.printer "Stop && remove services"
    docker-compose stop $2
    docker-compose rm $2
elif [[ "$1" == "bash" ]]; then
    if [[ ! -z "$2" ]]; then
        utils.printer "Connect to $2 bash shell"
        docker-compose exec $2 bash
    else
        utils.printer "You should specify the service name: claudia | claudia_cmd | claudia_api"
    fi
elif [[ "$1" == "sh" ]]; then
    if [[ ! -z "$2" ]]; then
        utils.printer "Connect to $2 bash shell"
        docker-compose exec $2 sh
    else
        utils.printer "You should specify the service name: claudia | claudia_cmd | claudia_api"
    fi
elif [[ "$1" == "logs" ]]; then
    if [[ "$2" == "api" ]]; then
        while true; do
            utils.printer "################## LOGGING API GATEWAY ##################"
            if [[ -z "$3" ]]; then
                docker-compose logs -f --tail=4 claudia_api
            else
                docker-compose logs -f --tail=$3 claudia_api
            fi
            clear
        done
    elif [[ "$2" == "webpack" ]]; then
        if [[ -z "$3" ]]; then
            docker-compose logs -f --tail=4 claudia
        else
            docker-compose logs -f --tail=$3 claudia
        fi
    elif [[ ! -z "$2" ]]; then
        utils.printer "Showing logs..."
        if [[ -z "$3" ]]; then
            docker-compose logs -f $2
        else
            docker-compose logs -f --tail=$3 $2
        fi
    else
        utils.printer "You should specify the service name: claudia | claudia_cmd | claudia_api"
    fi
elif [[ "$1" != "help" ]]; then
    export YARN_COMMAND="run $1"
    utils.printer "Run command"
    docker-compose build claudia_cmd
    docker-compose up claudia_cmd
else
    utils.printer "Params between {} are optional"
    utils.printer "{command} available: build|build:watch|create|update|destroy|invoke|test"
    utils.printer ""
    utils.printer "Usage: docker.sh [{command}|deploy|help]"
    echo -e "{command} --> Run services with command script"
    echo -e "deploy --> Build && deploy lambda"
    echo -e "help --> Show menu options"
fi

