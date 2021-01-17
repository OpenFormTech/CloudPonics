import { Directive, ViewContainerRef } from '@angular/core';

/**
 * https://angular.io/guide/dynamic-component-loader#loading-components
 * 
 * EXCERPT:
 * 
 * the directive basically acts as an anchoring point for angular to recognize where
 * dynamically added components should go.
 * 
 * this is fed into a ViewContainerRef so when coding you can access
 * the container to which the component will reside in
 */

@Directive({
  selector: '[widgetDirective]'
})
export class WidgetdirectiveDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
