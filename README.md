# Pixies Starter Static

### What does this starter include ?

This starter allows you to quickly start any web application using scss, javascript ES6 with a webpack development server :fire:

## Getting started 

Clone this repository

``` sh
$ git clone https://github.com/eggxman/starter-wip.git my-directory
$ cd my-directory
```

Install dependencies 

``` sh
$ npm install
```

*Note: this repository includes a [yarn.lock](https://yarnpkg.com/lang/en/) file*

You're ready to start !

### Development 

To start webpack development server use : 

```sh
$ npm run dev
```

*Note: server runs on port 7000 by default*

The server listens to every change in .html/.php, .scss and .js files and reloads your browser on save.

### Production 

To create distribution folder use : 

```sh
$ npm run build
```

It creates a /dist folder at directory root. All your file calls should point on **distributed files**

It also minify your distribution files. Keep it in mind for great performance.

## Features

This starter embed some cool features that you may be willing to use on development :)

### SCSS

Every .scss file should be imported in app.scss

```scss
@import "_project/00_base/*";
@import "_project/01_components/*";
@import "_project/02_modules/*";
@import "_project/03_layout/*";
@import "_project/04_page/*";
```

*Note: Files are globally imported thanks to [import-glob-loader](https://www.npmjs.com/package/import-glob-loader)*

This starter includes some usefull libraries :
* Bootstrap
* Normalize
* Sass-mq

#### Sass-mq

This sass library allows you to define variable breakpoints and simplify media-queries syntax

```scss
/* _config/_variables.scss */

$mq-breakpoints: (
  mobile: 640px,
  tablet: 768px,
  desktop: 1024px,
  wide: 1366px,
  xlarge: 1440px
);
```
```scss
/* _project/_02_modules/_article.scss */

.article {

  width: 100%;

  @include mq($from: tablet, $until: small-desktop) {
    width: 50%;
  }

}
```

*Full documentation available [here](https://github.com/sass-mq/sass-mq)*

#### Fonts mixin

You can define all the fonts style you need in _config/_fonts-mixins.scss.

```scss
@mixin font-title ($font: $font-regular, $font-size: 1.4rem, $weight : 400, $style: normal, $line-height : 2rem){
  font:{
    family: $font;
      style: $style;
    size: $font-size;
    weight: $weight;
  }
    line-height: $line-height;
}
```
Then call
```scss
.title {
  @include font-title();
}
```

### Javascript

Every .js file should be imported in app.js file.

This starter includes :
* Modernizr
* jQuery
* And some usefull custom ES6 classes 
    * Class to easily handles cookies
    * Class to create animated loader
    
#### Cookie.class

This class allows you to handle cookies very easily

You can set a cookie on a DOM event (like closing the mandatory cookie band). And launch a callback function either the cookie has been found or not.

```javascript
import Cookie from '../class/cookie.class'

let cookie = new Cookie({
    is_found: () => {console.log('the cookie has been found')}
    is_not_found: () => {console.log('the cookie hasn't been found)}
})
    
$(document).ready(function () {
    // Set the cookie on any DOM event.
    cookie.set()
})
```

#### Animated Loader

This class makes it easy to display a loader that will disappear only when $(document).ready is triggered

You just need to create a Loader instance :

```js
import Loader from './class/loader.class'

const loader = new Loader({
        devMode: false, // Mode developpeur
        onInit: () => {}, // Fonction déclenchée à l'initialisation du loader
        afterLoad: () => {}
    })
```

This loader has 2 callbacks which will be triggered when the loader starts and when it finishes.

*More info on [Loader options](src/js/class/loader.class.js)*

___

**Made with :yellow_heart: at Pixies Agency**