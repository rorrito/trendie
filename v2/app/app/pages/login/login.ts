import {Page} from 'ionic-framework/ionic';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


@Page({
  templateUrl: 'build/pages/login/login.html'
})

export class LoginPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  constructor() {
  	this.login = {};
  	this.util = {loading:boolean = false, boton:string = 'Log In'}

  }

  doLogin = function(){
  	this.util = {loading:boolean = true, boton:string = "Logging In..."}
  }

  // get diagnostic() { return JSON.stringify(this.login); }
}
