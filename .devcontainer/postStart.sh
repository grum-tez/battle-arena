#!/bin/bash

# Add the alias to .bashrc
echo 'alias ccli="npx completium-cli"' >> ~/.bashrc

echo "Setting executable permissions"
chmod +x /workspaces/battle-arena/backend/scripts/deploy_and_update_vite_env.sh
chmod +x /workspaces/battle-arena/backend/tests/bindings/swap_classes.pl
chmod +x /workspaces/battle-arena/frontend/contract-bindings/swap_classes.pl

echo "Done"
