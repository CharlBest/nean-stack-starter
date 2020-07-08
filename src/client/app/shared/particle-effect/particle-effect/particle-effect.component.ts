import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Use this component if you want to create a subtle flow of particles
// like in the background to give the effect that the site is alive
// or active and feels modern. This will maybe effect performance
// especially on first page load

@Component({
  selector: 'app-particle-effect',
  templateUrl: './particle-effect.component.html',
  styleUrls: ['./particle-effect.component.scss']
})
export class ParticleEffectComponent implements OnInit {

  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.generate();

    const clientWidth = document.documentElement.clientWidth;

    // Move all particles on the x axix according to the mouse position
    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(debounceTime(5))
      .subscribe((event: MouseEvent) => {
        this.container.nativeElement.style.marginLeft = `-${10 - (10 / (clientWidth / event.clientX))}px`;
      });

    // Regenerate particles when window resizes
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.generate());
  }

  generate(): void {
    const particleCount = document.documentElement.clientHeight / 27;

    this.container.nativeElement.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      const rndw = Math.floor(Math.random() * w) + 1;
      const rndh = Math.floor(Math.random() * h) + 1;
      const widthpt = Math.floor(Math.random() * 8) + 3;
      const opty = Math.floor(Math.random() * 5) + 2;
      const anima = Math.floor(Math.random() * 12) + 8;

      const div = document.createElement('div');
      div.classList.add('particle');
      div.style.marginLeft = `${rndw}px`;
      div.style.marginTop = `${rndh}px`;
      div.style.width = `${widthpt}px`;
      div.style.height = `${widthpt}px`;
      div.style.opacity = opty.toString();
      div.style.animation = `move ${anima}s ease-in infinite`;
      this.container.nativeElement.appendChild(div);
    }
  }
}
