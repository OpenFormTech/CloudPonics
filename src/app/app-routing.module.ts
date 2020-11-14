import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppModule } from './app.module';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
