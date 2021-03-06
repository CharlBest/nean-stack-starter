## BEST PRACTISES

* Add rel="noopener noreferrer" to all links opening external urls
* Remove unused imports especially Angular Material
* icons should have role and tooltip
* Remove all inline styles
* Button type should always be set to button or submit
* mat-icon-button should always contain a tooltop and aria-label
* Use this regex ]="[a-zA-Z$]*\((\$event)?\)" in VSCode to test templates to see if methods are being used to evaluate values
* Check that the viewModel from req.body is not accessing inner objects that might be undefined and throw an exception
* Add loading="lazy" to all image tags
* Prevent posting the same request when still in progress by hiding the form and showing preloader or disabling the submit button
* If possible provide a default for any input field
* font-size should be in em
* Microinteractions should be instant on user actions (click/taps) by trigger animations instantly

### Testing
* Responsiveness by resizing window
* Throttle network to 3G to slow down request responses
* Zoom browser in/out
* Test all browsers
* Check Lighthouse score in Chrome Dev Tools audit
* Google PageSpeed Insights - https://developers.google.com/speed/pagespeed/insights/
* Lighthouse Audit via Chrome DevTools
* Load test/scrape test to check load balance
* Sites
    * https://richpreview.com/
    * https://www.heymeta.com/
    * https://web.dev/
    * https://metatags.io/

### Run Node
* --max_executable_size=192
* --optimize_for_size 
* --gc_interval=100

### Tools
* Site color examples: https://dribbble.com/colors/8930e8
* Site font examples: https://fontsinuse.com/
* Compress PNG size: https://pngquant.org/