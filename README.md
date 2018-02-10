# mac.are.na ![Travis build status](https://travis-ci.org/broskoski/mac.are.na.svg?branch=master)

Are.na channel -> 🎶

## Installation
1. Copy `.env.sample` to `.env`
2. Replace `REACT_APP_SOUNDCLOUD_CLIENT_ID` with your Soundcloud secret
3. Run:
```
yarn install
yarn start
```

## App Structure
This app uses a single state in `<Main />` and passes this state first through a router, then to it's child components. Using a single, faux-redux-like state has many benefits – predictability, flexibility and simplicity. Methods and event handlers are treated the same way. Without local state, there is no confusion over where props originate or how different states interact. Items in the state can always be compared or updated.

## Contributors
This project is maintained by [Gavin Atkinson](https://github.com/gavinpatkinson), [Charles Broskoski](https://github.com/broskoksi), [Callil Capuozzo](https://github.com/callil), and [Sam Hart](https://github.com/hxrts)
