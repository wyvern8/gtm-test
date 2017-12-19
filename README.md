# gtm-test
Template repo for integration tests and starting point for github-task-manager agent extensions and plugins.  https://github.com/wyvern8/github-task-manager

Please note that custom plugin development is only supported as far as exposing the extension points.  It is your responsibility to design and debug your plugins.

## install
- fork this repo and `npm install`
- copy `.envSample` to `.env` and update to suit your deployment.
- make any required changes to `serverless.yml`
- `npm run sls-deploy` to deploy to AWS Lambda.

## customise
Add plugins by adding new Executors and EventHandlers in:
```
./src/executors
./src/handlers
```
Follow the Sample plugins in each.  To customise the agent or other aspects, you can override or extend the exposed Agent and AgentUtils.  Refer to index.js and source of https://github.com/wyvern8/github-task-manager

## test
`npm test` assuming you have created unit tests for your customisations.

## build
`npm run build`

## run agent
`npm run agent` to start an agent with your customisations

This assumes you have deployed the serverless assets.

## dockerized agents
- Use the provided Dockerfile to build the custom image for your private registry.
- Use the provided docker-compose.yml to start a container without image build.

This assumes you have deployed the serverless assets.

