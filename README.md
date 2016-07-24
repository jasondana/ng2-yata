# Yet Another Typeahead for Angular2

A simple typeahead implementation which allows for autocompletion of input
values separated by whitespace.

[![Build Status](https://travis-ci.org/jasondana/ng2-yata.svg?branch=master)](https://travis-ci.org/jasondana/ng2-yata)

![demo](http://i.imgur.com/geTk3dk.gif)

## Install

```sh
npm install ng2-yata --save
```

## Usage

```js
import { Component } from '@angular/core';
import { Yata } from 'ng2-yata';

@Component({
  template: `<yata [placeholder]="placeholder"
                   [inputStyle]="inputStyle"
                   [inputStyleClass]="inputStyleClass"
                   [suggestions]="suggestions"
                   [(ngModel)]="filterValue"
                   (onComplete)="onInputComplete($event)></yata>`,
  directives: [ Yata ]
})
export class AppComponent {
  private placeholder: string = 'Enter Text';
  private suggestions: string[] = []; // available suggestions
  private filterValue: string = '';
  private inputStyle = ''; // input element inline css style
  private inputStyleClass = { // input element style classes to apply
    'form-control': true,
    'conditional-style-class': apply
  };
  private apply: boolean = false; // conditionally apply the css class

  onInputComplete(event: any) {
    // Input value accessible through event.value and this.filterValue
    // Find suggestions and populate suggestions array
  }
}
```

### Additional Attributes
`style`
Containing element inline style.

`styleClass`
Containing element style classes.

`delay`
The amount of milliseconds to wait, after typing has stopped, to execute the
`onComplete` callback.
