# React Redux TypeScript Starter Kit

## Quickstart

```
git clone https://github.com/sharpcoding/react-redux-typescript-starter-kit.git
npm i
npm run dev
```

and if everything goes right, a browser tab window tab should be opened automatically pointing to http://localhost:9000/. 

Chrome Web Browser with [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) is recommended. You can play around with code and see changes as they appear by hot-reloading.

If this seems too much, see the [running demo](https://sharpcoding.github.io/react-redux-typescript-starter-kit/).

## Purpose

This starter kit summarizes good practices in front-end development, focused around the following front-end technology stack:

- [x] React v15
- [x] Redux v3.7
- [x] TypeScript v2.7
- [x] d3 v4.7
- [x] SASS/LESS
- [x] Webpack v4.1
- [x] tslint v2.7
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [x] Jest

The purpose of this repository is to:
- encourage developers community to use TypeScript with React Redux development,
- provide a fast way to start writing mature and streamlined front-end applications.

# Decisions made

- [x] Feature-oriented (not role-oriented) code structure
- [x] Typescript and Webpack path aliases (defining "semantic namespaces")
- [x] index.ts/index.tsx re-exports
- [x] Redux store:
  - [x] React state is an interface
  - [x] Action types are defined as constants
  - [x] Actions are defined as ES6 classes
  - [x] Actions acceptable by a reducer make-up a discriminated union type
  - [x] Action creators are plain functions
  - [x] Reducers are plain functions
  - [x] Redux-thunk effects are higher-order functions
- [x] tslint with [VSCode tslint extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
- [x] Webpack-npm scripts for [development](/webpack/dev.config.js), [publishing](/webpack/prod.config.js) and [bundle analysis](/webpack/analyze.config.js)
- [ ] Bootstrap v4
- [ ] Custom SCSS with variables exported to ECMAScript
- [x] Snapshot testing with Jest

## Redux

In this paragraph we go a little bit into decision details regarding TypeScript Redux programming, yet, it can be summarized with the following rule:

**use constructs that are already provided in the ECMAScript/TypeScript whenever possible**.

This makes application of helper-libraries like [react-actions](https://github.com/redux-utilities/redux-actions) redundant. More precisely, we used react-actions **typings** in the past and found it really cumbersome, awkward to use and - in the context of type safety - limiting.

### State is just an interface

```
interface IEngine {
  started: boolean;
  currentGear: number;
}
```

### Action types are defined as constants (not plain strings)

Do not use / reuse Redux actions as plain texts:

```
export const START_ENGINE = 'START_ENGINE';
export const GEARS_UP_DOWN = 'GEARS_UP_DOWN';
```

### Actions are defined as ES6 classes

An action is just an object. Rearding Redux store requirement it is a plain object having the *type* property:
```
interface Action {
  type: string;
}
```

Actions are defined by the class construct, which is a great way to:
- keep action and it's type in the same place
- define action properties by constructor arguments with *public* modifier.

```
import { Action } from 'redux';
import * as actionTypes from './action-types';

class StartEngineAction implements Action {
  public readonly type = actionTypes.START_ENGINE;
}

class GearsUpDownAction implements Action {
  public readonly type = actionTypes.GEARS_UP_DOWN;
  constructor(public gears: number) { }
}
```

Actually, the ES6 classes not only describe actions - when used with *new* keyword, these are in fact the action creators (please read on). For this reason - and because actions objects created this way are "not plain" - this aspect of TypeScript Redux approach might change in the future.

### Action creators are plain functions

Action creators are functions that create actions. The responsibility of action creators is to:
- create action objects,
- make them "plain" (not prototype-linked to any function) again,
- expose the some kind of API to Redux store application, as an example here we see the action creator disallowing user to change more than one gear at a time

```
import * as _ from 'lodash';
import { StartEngineAction, GearsUpAction } from './actions';

type IStartEngineActionCreator = () => StartEngineAction;
type IGearUpActionCreator = () => GearsUpDownAction;
type IGearDownActionCreator = () => GearsUpDownAction;

const start: IStartEngineActionCreator = () =>
  _.toPlainObject(new StartEngineAction());

const gearUp: IGearUpActionCreator = (gears: string) =>
  _.toPlainObject(new GearsUpAction(1));

const gearDown: IGearDownActionCreator = (gears: string) =>
  _.toPlainObject(new GearsUpAction(-1));

export {
  start,
  IStartEngineActionCreator,
  gearUp,
  IGearUpActionCreator,
  gearDown,
  IGearDownActionCreator,
};
```

Please note these simple functions are described by TypeScript type aliases (in order to reuse in React containers as prop types !)

### Reducers are plain functions

Reducers are plain functions that make use of [discriminated union types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) - this is big win for TypeScript development, having an appropriate action type (one of an union) "magically" cast in the relevant *case* block. So, any breaking changes to:
- action types defined,
- action definitions that are available,
- available action parameters and types
will be easily detected by TypeScript and reported as an error.

```
import * as _ from 'lodash';
import * as engineActionTypes from './action-types';
import { StartEngineAction, GearsUpDownAction } from './actions';
import { IEngine } from './state';

const initialState: IEngine = { started: false, currentGear: 1 };

export type EngineReducerActionTypes = StartEngineAction|GearsUpDownAction;

export const engineReducer = (state: IEngine = initialState, action: EngineReducerActionTypes): IEngine => {
  switch (action.type) {
    case engineActionTypes.START_ENGINE:
      return { ...state, started: true } as IEngine;
    case engineActionTypes.GEARS_UP_DOWN:
      return { ...state, currentGear: state.currentGear + action.gears } as IEngine;
    default:
      return state;
  }
};
```

### Redux-thunk effects are higher-order functions

We believe there is nothing like an "async action" or the like. We highly encourage developers to consciously use the term "effect", which is just an higher-order function (function that returns other function - in case of redux-thunk, the one with *dispatch* argument).

As an example, lets imagine a two gears up change in the engine is asynchronous and we want to make it in a safe way:

```
import * as _ from 'lodash';
import { Dispatch } from 'react-redux';
import { GearsUpDownAction } from './actions';

type ITwoGearsUpEffect = () => (dipatch: Dispatch<void>) => void;

const twoGearsUp: ITwoGearsUpEffect = () => (dispatch: Dispatch<void>) => {
  new Promise((resolve, reject) => setTimeout(() => resolve(), 1500))
  .then(() => dispatch(_.toPlainObject(new GearsUpDownAction(2))));
};

export {
  twoGearsUp,
  ITwoGearsUpEffect,
};
```

## Webpack and Typescript path aliases


```
import { BubbleChart } from '@components/bubble-chart';
```

instead of:
```
import { BubbleChart } from '../../../src/components';
```


# General TypeScript remarks

TypeScript is - we believe - a great way to write JavaScript applications today. Besides type-safety, there plenty of other great benefits:

- targeting different existing/old ECMAScript versions
- targeting future ECMAScript versions, i.e. incorporating recommendations/proposals - right here and right now
- seamless handling of different bundle systems like UMD, AMD, CommonJS
- intellisense in the IDE (!)
- dedicated linter (tslint)
- active development and great community

However, there are special ares of interest when developing with TypeScript:

- partial import in TypeScript as as good as the typings (d.ts) are, e.g. lodash typings does not currently support partial loading, resulting in much bigger bundle sizes
- loading module variables out of the SCSS into TypeScript module is not seamless - it requires writing a dedicated scss.d.ts file,
- some libraries that work quite well in pure ES6, are not a great choice when used in TypeScript (please read on for details)
