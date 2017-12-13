// import { TestBed, async } from '@angular/core/testing';
// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
// import { NavigationModule } from './shared/navigation/navigation.module';
// import { APP_BASE_HREF } from '@angular/common';

// describe('AppComponent', () => {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 AppComponent
//             ],
//             imports: [
//                 AppRoutingModule,
//                 NavigationModule
//             ],
//             providers: [
//                 { provide: APP_BASE_HREF, useValue: '/' }
//             ]
//         }).compileComponents();
//     }));

//     it('should create the app', async(() => {
//         const fixture = TestBed.createComponent(AppComponent);
//         const app = fixture.debugElement.componentInstance;
//         expect(app).toBeTruthy();
//     }));

//     it('has footer', async(() => {
//         const fixture = TestBed.createComponent(AppComponent);
//         fixture.detectChanges();
//         const compiled = fixture.debugElement.nativeElement;
//         expect(compiled.querySelector('footer').innerHTML).toBeTruthy();
//     }));
// });
