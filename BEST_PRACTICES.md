## BEST PRACTISES

* Add rel="noopener" to all links opening external urls
* Remove unused imports especially Angular Material
* mat-icon should have role and tooltip
* Remove all inline styles
* Button type should always be set to button or submit
* mat-icon-button should always contain a tooltop and aria-label

### Testing
* Responsiveness by resizing window
* Throttle network to 3G to slow down request responses
* Zoom browser in/out
* Test all browsers
* Check Lighthouse score in Chrome Dev Tools audit
* Google PageSpeed Insights - https://developers.google.com/speed/pagespeed/insights/
* Lighthouse Audit via Chrome DevTools
* Load test/scrape test to check load balance