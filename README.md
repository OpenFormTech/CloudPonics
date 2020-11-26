![CloudPonics Logo](src/assets/images/LogoTransparent.svg)

A cloud SaaS designed for distributed computational botany and automated plant phenome mapping for agricultural and academic research. Implements identity and access management, a real time cloud database, IoT fleet management, and 'surrogate model' machine learning.

Developed to be used with [PeaPod](https://github.com/OpenFormTech/PeaPod-RPi) and other [OpenForm Tech](https://github.com/OpenFormTech) devices.

# Development

1. Clone the repository, and navigate to it with a terminal.
2. Execute `npm install .`
3. To run the Hosting emulator, execute `ng serve` and navigate to `localhost:4200` in a browser.

## References

1. [Angular](https://angular.io/)
2. [Angular Bootstrap](https://ng-bootstrap.github.io/#/components/)
3. [AngularFire](https://github.com/angular/angularfire)
4. [FirebaseUI Angular](https://www.npmjs.com/package/firebaseui-angular)

## Init

1. `ng new cloudponics`
2. `cd cloudponics`
3. `npm i firebase firebaseui firebaseui-angular bootstrap --save`
4. `ng add @angular/fire @ng-bootstrap/ng-bootstrap`

# Building and Deployment

Execute [`ng deploy`](https://angular.io/start/start-deployment) in the local directory.