## Quick Start Installation

```bash
nvm use 9 #node 9 or above
yarn run install:cli
yarn install
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Test

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```


## Contact 

- Author - Nick Mitchell nick@kitset.io


## API 
The main swagger docs can be found by `yarn run start:dev` 
then navigating to [http://localhost:3000/docs](http://localhost:3000/docs)



## Development 
#### Elastic Search queries
See the [wiki](https://itdwiki.det.nsw.edu.au/display/UD/Elasticsearch+APIs+for+frontend)

### Versioning

The version structure of this application aligns roughly to the JIRA board, that is:

- The **MAJOR** version aligns to the JIRA Release eg. v1 for MVP
- The **MINOR** version aligns to the sprint number which is currently sprint 4 eg. v1.4
- The **PATCH** version aligns to the CI build system build number which is generated for each deployment.

