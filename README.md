## My photo blog

The whole environment is based on `webpack 4`, `pug templates` and the input data are `json files`.
The page consists of the pictures themselves, therefore I load the photos dynamically using 'IntersectionObserver'. In addition, each picture is served in several sizes depending on the width of the window.

To generate such a number of photos I used my script which, based on the original, generates folders with appropriate image sizes -> [sharp-images](https://github.com/tomik23/sharp-images)

```
The json files have been prepared by this [application](https://github.com/tomik23/json-generator)
```

```html
<picture>
    <source data-srcset="./images/576/img.jpg" media="(max-width: 576px)" class="fade-in" srcset="./images/576/img.jpg">
    <source data-srcset="./images/768/img.jpg" media="(max-width: 768px)" class="fade-in" srcset="./images/768/img.jpg">
    <source data-srcset="./images/992/img.jpg" media="(max-width: 992px)" class="fade-in" srcset="./images/992/img.jpg">
    <source data-srcset="./images/1200/img.jpg" media="(max-width: 1200px)" class="fade-in" srcset="./images/1200/img.jpg">
    <img data-src="./images/1200/img.jpg" class="fade-in" src="./images/1200/lwow/.jpg">
    <noscript><img src="./images/1200/img.jpg"></noscript>
</picture>
```

Of course, this solution is compatible with SEO - photos are indexed by google.
The addition is an essential element `<noscript><img src="./images/1200/img.jpg"></noscript>`

After optimizing images, the page `PageSpeed Insight` shows **`100/100`** in the results.



### Production version

Visit online: [http://www.grzegorztomicki.pl](http://www.grzegorztomicki.pl)

