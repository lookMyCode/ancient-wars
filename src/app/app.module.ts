import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArrLimitPipe } from './pipes/arr-limit.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RgbToColorPipe } from './pipes/rgb-to-color.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ArrLimitPipe,
    RgbToColorPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
