import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service';

// Use this service if you want to output some sick ascii art in the console
// showing off your brand or something

@Injectable({
  providedIn: 'root'
})
export class ASCIIArtService {
  // https://www.ascii-art-generator.org/
  private readonly styles = `font-family: monospace; font-size: large; color: ${this.themeService.primaryColor};`;

  constructor(private themeService: ThemeService) { }

  banner() {
    console.log(`%c
#     # #######    #    #     #
##    # #         # #   ##    #
# #   # #        #   #  # #   #
#  #  # #####   #     # #  #  #
#   # # #       ####### #   # #
#    ## #       #     # #    ##
#     # ####### #     # #     #
    `, this.styles);
  }

  block() {
    console.log(`%c
_|      _|  _|_|_|_|    _|_|    _|      _|
_|_|    _|  _|        _|    _|  _|_|    _|
_|  _|  _|  _|_|_|    _|_|_|_|  _|  _|  _|
_|    _|_|  _|        _|    _|  _|    _|_|
_|      _|  _|_|_|_|  _|    _|  _|      _|
    `, this.styles);
  }

  lean() {
    console.log(`%c
    _/      _/  _/_/_/_/    _/_/    _/      _/
   _/_/    _/  _/        _/    _/  _/_/    _/
  _/  _/  _/  _/_/_/    _/_/_/_/  _/  _/  _/
 _/    _/_/  _/        _/    _/  _/    _/_/
_/      _/  _/_/_/_/  _/    _/  _/      _/
    `, this.styles);
  }

  slant() {
    console.log(`%c
    _   ___________    _   __
   / | / / ____/   |  / | / /
  /  |/ / __/ / /| | /  |/ /
 / /|  / /___/ ___ |/ /|  /
/_/ |_/_____/_/  |_/_/ |_/
    `, this.styles);
  }
}
