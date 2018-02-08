# mac.are.na

[Are.na channel -> playlist]

## Installation
1. Copy `.env.sample` to `.env`
2. Replace `REACT_APP_SOUNDCLOUD_CLIENT_ID` with your Soundcloud secret
3. Run:
```
yarn install
yarn start
```

## Todo
- [x] Play / Pause buttons
- [x] Next / Prev buttons
- [x] Go to next track on finish
- [x] Play youtubes, mp3s
- [x] Skip missing tracks
- [x] Pagination on root playlist
- [ ] Pagination on long channels


### App Structure
This app uses a single state in <Main /> and passes this state first through a router, then to it's child components. Using a single, faux-redux-like state has many benefits – predictability, flexibility and simplicity. Methods and event handlers are treated the same way. Without local state, there is no confusion over where props originate or how different states interact. Items in the state can always be compared or updated.
