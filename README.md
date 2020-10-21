![CloudPonics Logo](public/src/images/LogoTransparent.svg)

A cloud SaaS IoT dashboard, implementing Identity and Access Management for users and organizations, realtime device monitoring and management, and cloud storage.

Developed to be used with [PeaPod](https://github.com/OpenFormTech/PeaPod-RPi) and other [OpenForm Tech](https://github.com/OpenFormTech) devices.

# Development

1. Clone the repository, and navigate to it with a terminal.
2. Execute `npm install`.
3. If you haven't before, install the [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).
4. Execute `firebase init`, and login to Firebase with your credentials. 
5. For all following prompts (in order):
    - Select _Hosting_ and _Emulators_
    - `public`
    - `n`
    - `n`
    - `n`
    - Select _Hosting Emulator_
    - `y`
6. To run the Hosting emulator, execute `firebase serve` and navigate to `localhost:5000` in a browser.