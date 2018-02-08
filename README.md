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
This app aggressively uses a single state in <Main /> and passes everything down through a router, then to it's child components. Using a single, faux-redux-like state has many benefits – predictability, flexibility and simplicity. Methods that interact with the state are placed in <Main /> and passed as props to children as well. Without local state, there is no confusion over where props originate or how different states interact. Items in the state can always be compared or updated.
