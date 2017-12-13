// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';

// import { EmojiPanelComponent } from './emoji-panel.component';
// import { MatTabsModule, MatIconModule, MatButtonModule } from '@angular/material';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { OverlayModule } from '@angular/cdk/overlay';
// import { A11yModule } from '@angular/cdk/a11y';

// describe('EmojiPanelComponent', () => {
//     let component: EmojiPanelComponent;
//     let fixture: ComponentFixture<EmojiPanelComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [EmojiPanelComponent],
//             imports: [
//                 NoopAnimationsModule,
//                 MatTabsModule,
//                 MatIconModule,
//                 MatButtonModule,
//                 OverlayModule,
//                 A11yModule
//             ]
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(EmojiPanelComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('default panel open state is closed', async(() => {
//         expect(component.isOpen).toBe(false);
//     }));

//     it('default option for closing when emoji gets inserted is to stay open', async(() => {
//         expect(component.closeOnInsert).toBe(false);
//     }));

//     it('8 initialised emoji categories', async(() => {
//         expect(component.emojiCategories.length).toEqual(8);
//     }));
// });
