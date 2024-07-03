#!/bin/sh
sudo apt-get update -y
sudo apt-get install software-properties-common -y
sudo add-apt-repository -y "ppa:serokell/tezos"
sudo apt-get update -y
sudo apt-get install -y tezos-client
yarn install
npx completium-cli init
python -m pip install aider-chat
# playwright for enabling aider web-scraping for adding documentation to context
# playwright install --with-deps chromium
