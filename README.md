# WeddingTables

A simple application that helps seat wedding guests at round tables.

[Demo](https://12luckydev.github.io/wedding-tables/)

## Features

- Grouping guests with colors
- Imports guest from txt or json files
- Exporting table order with options like anomization or counters
- Guest metadata
- State saving in local storage or in txt file

## Guests data importing

Guests can be imported from a txt file, with each row being a new group. Guests within a group are separated by the "," character.

```js
Name Surname // guest without a group
Name Surname, Name Surname //two guests in group
```

If guests are to be imported with metadata, a json file must be imported.

```js
[
  'Name Surname', // guest without a group
  ['Name Surname', 'Name Surname'], //two guests in group
  { name: 'Name Surname' }, // guest without a group
  {
    name: 'Name Surname',
    metadata: { keyString: 'string value', keyNumber: 123, keyBoolean: true },
  }, // guest without a group, but with metadata
  [{ name: 'Name Surname' }, { name: 'Name Surname' }], //two guests in group
];
```

### Used libraries

- angular 20.0.3
- angular/material 20.0.3

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.4.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
