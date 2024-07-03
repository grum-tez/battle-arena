Battle Arena educational dapp

A few final setup commands that must be run in an interactive shell:

```
echo 'alias ccli="npx completium-cli"' >> ~/.bashrc
source ~/.bashrc
nvm install 16
nvm use 16
ccli init
ccli mockup init
```

Sandbox resource:

https://claudebarde.medium.com/flextesa-the-swiss-army-knife-of-development-on-tezos-f2783fad966e

TODO: 

- Update pages deployment to always run yarn g:update from backend before deployment so that the environment variables always refer to a ghostnet contract. More robust solution preferable but that should work. That will also need to run with node version 16 to work. Simple alternative - check if frontend .env tezos network name variable is not 'sandbox' and do not permit deployment if it is.