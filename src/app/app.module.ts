import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginModule } from './login/login.module';
import { LandingModule } from './landing/landing.module';
import { AuthService } from './services/auth.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { SidebarComponent } from './dash/sidebar/sidebar.component';
import { NavbarComponent } from './dash/navbar/navbar.component';
import { WidgetspaceComponent } from './dash/widgetspace/widgetspace.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    WidgetspaceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    // NgbModule,
    LoginModule,
    LandingModule,
    DashboardModule,
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
 