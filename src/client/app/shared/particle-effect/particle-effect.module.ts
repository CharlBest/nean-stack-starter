import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ParticleEffectComponent } from './particle-effect/particle-effect.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ParticleEffectComponent
  ],
  exports: [
    ParticleEffectComponent
  ]
})
export class ParticleEffectModule { }
