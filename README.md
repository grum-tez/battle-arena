## Battle-arena dapp

### Do not use a sandbox:

- Do not attempt to use the sandbox for development with this dapp - just use `yarn g:update` and develop the contract on the ghostnet. There are some references to mainnet and sandbox in this repo, but this functionality has been removed. 

### Backend updates:
- To update the contract, you must edit battlemaster.arl, then update the contract on the ghostnet with `yarn g:update` then run `yarn dapp-bind` in the the backend workspace when you are ready to connect the updated contract to the frontend. 
- To test the contract before updating the contract on the chain, you can run `yarn test-bind` and then run the test suite.
- Unfortunately, archetype has limited support for events, and for this reason hacky changes must be made to the created bindings in battlemaster.ts. The updated classes can be found in the bindings foldres, and the "swap_classes.pl" file swaps these hacky changed bindings for the broken bindings generated by archetype. Hopefully archetype will properly support events emitting more complex structures at some point and this can be removed. If contract tests fail, this may be due to incompatibility between the bindings and the hacky changes.

### Frontend updates:
- After making updates to the frontend, you can check for compilation errors in the usual way by running yarn build in the frontend workspace/folder. Github actions will run this as part of the automatic deployment action on push to main in any case.

### Console errors
On my last update, I observe errors in the developer console for chrome: `Uncaught (in promise) TypeError: Cannot read properties of null (reading 'domains')`, related to `replaceReferrals.js`, a chrome extension file. I also observed a similair error on the better call dev site, so my current guess it is an issue with the temple wallet extension or something about my local setup. As these didn't effect functionality, I didn't try to chase the bug down. 