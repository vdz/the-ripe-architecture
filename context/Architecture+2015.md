# The Ripe Method
# Chegg, React & Redux
= How we build Front-end applications, so we can maintain and scale them easily, and enjoy the process! We call our process "Ripe".

## Introduction & Motivation
We'd like to clear the mist and introduce a clear way of thinking Redux & React for better scalable and better maintainable Front End architecture. We call it The Ripe Method, (since we need to call it something). 

This document will walk you through the process of setting up your Front End application using The Ripe Method. We will also introduce a suite of specialized tools we have created to aid you in this in order to make it faster, cleaner and with less mistakes.

### What You'll Find In This Document
In addition to general explanation about why we chose Redux and React will also cover subjects listed below.

1. Experience taught us ...
2. The idea behind it all
3. The method — the general outline 
4. The outcomes: what are trying to achieve
5. Simple means easy maintenance means longer life
6. Code:
	6.1.  how to write a component
	6.2.  how to connect a component to the app (redux, thunk, logging)
	6.3.  how to style it & use Sunkist-CSS component
	6.4.  how to write an API helper
	6.5.  how to write a connected helper
	6.6.  how to manage its data matchers
	6.6.  how to write tests for it	
	6.7.  how to manage and config routes
	6.8.  how to work with routes (config, composition, data matchers)
	6.9.  how to manage environments and configs
	6.10. how to manage service scripts
	6.11. how to create build packages & scripts
	6.12. how to deploy our apps
	6.13. how to npm-package our stuff
7. Setting up your work environment:
	7.1.  getting started with NPM
	7.2.  getting started with the Ripe Boilerplate
	7.3.  understanding how Webpack works with create-react-app & Ripe
	7.4.  setting up watcher for easy development
	7.5.  Ripe Boilerplate: scripts & functionality
8. Example code (Math Definitions)  
9. Next

## Redux & React: Why They Work Together So Well
Inspite of the ocean of information on the subject, we'd like to briefly stress the main things that matter.

React is a reactive view solution for front-end. It's great for managing Components that render some stuff. Component has a simple life cycle. Component gets information from the outside.

That's enough about React for our purposes. 

The hero of our story, however, is Redux. Redux — simply put — manages application state and inner-app communication. It also wires Components to said state, so that when the state changes the Components react accordingly (pun intended).

So we see that application state is the brain of our app, and it will automatically affect our (reactive) Components — our view. State composition is one of first tasks you should consider when planning a new FE app. Let us try to understand the concept of state better, from our Ripe point of view.

### What is Redux State
Application state is a tree. Each branch represents either a specific application flow, or a process. It's vague I know, but let's hope that some example will help us understand it.

An example of application state for Math-Definitions application. We will use [Math-Definitions](https://bitbucket.cheggnet.com/projects/MB/repos/math-definitions/browse) as an example of a simple app used to render explanations for various mathematical terms for mobile Math Solver app.
```
{
	app : {  // a branch for general application purposes
		loaded : false,
		all_fonts_loaded : false,
		online : false
	},
	router : { // application router (react-router)
		path: '',
    params: {},
    name: ''
	},
	current_definition : { // a branch for managing the display of a current definition
		id : null,
    title : '',
    description : '',
    status : <default status>, // enum defined elsewhere
    error : null
	},
	no_internet : { // a branch for managing the display of network error screen
		show : false
	}
}
```

Your state object is not your model. It will contain only information relevant and necessary to your app's functionality. You know — application state.

Each state branch is managed by its own reducer. A reducer for a branch (more on this in a bit). Once state changes, our reactive components react accordingly. So managing the state is basically managing our application.

### Unidirectional Flow of Application Messaging
How does Redux helps us to manage our app? Let's explain it in a very simple way:
1. You declare a (reactive) UI component that reacts to specific state changes.
2. If user performs some action our applications "shouts" that it wants an action to be performed. Action has a unique name, and sometimes an appropriate payload.
3. A code called "reducer" listens to actions relevant to its branch state, and alters it branch accordingly when such actions occur.
4. All components subscribed to a specific state change react accordingly. 

Redux allows us to define "a store" for our app. A store has 3 main functions:
1. getState() — gives you the current state object.
2. subscribe() — allows us to subscribe to state changes.
3. dispatch() — allows us to "shout" out actions (to be "heard" by the reducers).

Redux allows us high level of extensibility. You can add new branches to your state with their own reducers easily. (More on that later.)

### Reducers
Reducer is pieces of code that manage a single branch of our state. A reducer file has 2 main components:
1. A definitions of the default state for the managed branch, and
2. A reducer function that will react to specific application messages — called actions — and will create a new state according to the application logic for the specific action. `reducer(state, action)`

Reducers contain the core business logic of our app — they decide how application state is altered.

An example of a reducer:
/Screen Shot 2018-08-26 at 13.34.19.png
```
import { LOADING_STATES } from "../../store/constants";
import {
    DEFINITION_LOAD,
    DEFINITION_LOAD_DONE,
    DEFINITION_LOAD_ERROR
} from "./definition.actions";

export const default_state = {
    id : null,
    title : '',
    description : '',
    status : LOADING_STATES.START,
    error : null
};

export default function reducer(state = default_state, action){
    switch (action.type) {
        case (DEFINITION_LOAD):
            return {
                ...state,
                status : LOADING_STATES.LOADING,
                id : action.id
            };

        case (DEFINITION_LOAD_DONE):
            return {
                ...state,
                status : LOADING_STATES.LOADED,
                title : action.definition.title,
                description : action.definition.description
            };

        case (DEFINITION_LOAD_ERROR):
            return {
                ...state,
                status : LOADING_STATES.ERROR,
                error : action.error
            };
    }

    return state;
}
```

**What can we always say about our Reducers?**
1. `reducer` function is the default export of the *.reducer.js* file that we have here.
2. `reducer` function always returns the state it manages. By default the unaltered state version (previous state): `reducer(state = default_state, ` ... `return state;`
3. *.reducer.js* file exports the default state of the state branch it manages: `export const default_state = {...}`

Going on to Actions ...

### Actions
Actions are the messages that are the blood flowing through the veins of your Redux application. Action is a simple object that declares *what* you want, and a *content/payload* for what you want. 

*What* we want is to change the application state. Let's look at an example:
```
{
    type : 'definition load done',
    definition : { ... }
}
```

The above action asks to notify our app about a loaded definition, and provides said definition as a payload.

Once the Action is dispatched to our Redux store — `store.dispatch({ type : 'please turn on AC', temp : 25 })` — reducers will be notified and will respond accordingly, (and affect their portion of the state).

*definition.reducer.js* file listed above will react to the action with a state change, supplying its state branch with information about the loaded definition.

### Action Creators, Redux Thunk & Async operations
At times we'd like to fire of a series of actions depending on some logic. Sometimes we'd like this to be an async process with branching outcomes, each requiring a different action to be dispatched. How should we handle this, why would we have such a need, and how to organise it all in our code? 

Imagine that we have a UI component to show us a Math definition. Now imagine that our we first need to load this definition off our content server. Each time an appropriate state branch will be updated, thus allowing our Definition view component to react to the changes and show the definition or a loading indicator, or error, or whatever.

In order to accomplish these we'll use Action Creators. Action Creator is a function that return an Action object.

Also we use [Redux Thunk](https://github.com/reduxjs/redux-thunk) to empower our Action Creators to delay the dispatch of an action, or to dispatch only if a certain condition is met.

Redux Thunk is wired into our store as a middleware. You don't need to wire it if you are using the Ripe Boilerplate, but in case you are wondering how it works — read more on [Redux Thunk Installation](https://github.com/reduxjs/redux-thunk#installation).

After the initial setup Redux Thunk will remain transparent to us, and will provide each action creator with the methods `store.dispatch` and `store.getState` functions as parameters.

So our Action Creator is a pure Javascript function that returns either:
1. an action object to be dispatched, or
2. a function that dispatches actions when some conditions are met.

But let's backtrack a little, recap and start simple:
1. An action is defined uniquely by it's `type` — a simple and unique string identifying the action in a humanly understandable language:   
```
const DEFINITION_LOAD = "definition load";
const DEFINITION_LOAD_DONE = "definition load done";
const DEFINITION_LOAD_ERROR = "definition load error";
```
2. We'd like to group our action definitions in files named in the following manner `<component_or_other_groupping_theme>.actions.js`, and we export the action definitions so we can use them elsewhere as well.
3. Actions creators can be something as simple as returning the appropriate action definition:
```
function definitionLoad(id) {
		if (!id) return {
			type : DEFINITION_LOAD_ERROR,
			error : 'CANNOT LOAD DEFINITION: No Definition ID provided.'
		} else return {
			type : DEFINITION_LOAD,
			id
		}
}
```

4. Using Redux Thunk we can create a more elaborate Action creators.

Let's do an example:
/Screen Shot 2018-08-26 at 14.57.23.png
> please disregard the `setTitle` lines — they are utilities to talk to our native apps via a Mobile Bridge we'd built. Please see the slightly revised code, that will better serve the goal of this tutorial.

In the following example we'd like to load a Math Definition using our GraphQL API or use a cached version. 
```
//_ What we import
import { getDefinition } from "./definition.api"; // GraphQL function
import * as cache from "../../modules/cache"; // Cache functions

//_ What we export
// Action definitions
export const DEFINITION_LOAD = "definition load";
export const DEFINITION_LOAD_DONE = "definition load done";
export const DEFINITION_LOAD_ERROR = "definition load error";
// Action creators
export {
    definitionLoad
}

function definitionLoad(id) {
    return (dispatch) => {
        if (!id) {
	        dispatch({
			    type : DEFINITION_LOAD_ERROR,
			    error : 'CANNOT LOAD DEFINITION: No Definition ID provided.'
	        });
	        return;
	    }

        dispatch({
            type: DEFINITION_LOAD,
            id
        });

        let cached = cache.get( { id });
        if (cached) {
            dispatch({
                type : DEFINITION_LOAD_DONE,
                definition : cached
            });

            return;
        }
        
			// getDefinition(id) returns a promise
        return getDefinition(id)
            .then(result => { // result is a Math Definition data, received from GraphQL
                cache.set({ data : result }); // cache it

                dispatch({
                    type : DEFINITION_LOAD_DONE,
                    definition : result
                });
            })
            .catch(e => { // network or GraphQL error 
                dispatch({
                    type : DEFINITION_LOAD_ERROR,
                    error : `CANNOT LOAD DEFINITION: ${e}`,
                    retry_definition_id : id
                });
            });
    }
}
```

Ok, so the code is pretty self explanatory, but let's hit the main parts anyway:
1. Input validation — if fails returns an Action object and exits in the screenshot, and in our code example, just dispatches the action.
2. Otherwise returns a function with `store.dispatch()` as a param for delayed dispatch — this is what Thunk does for us behind the scenes.
3. Dispatches `DEFINITION_LOAD` action to signify that definition load process was initiated.
4. If the definition we are trying to load is cached, dispatches `DEFINITION_LOAD_DONE` action with the definition object as a payload,
5. Otherwise returns a Promise that uses Async XHR to get the definition from a remote GraphQL server. 
6. In case it resolves successfully, we cache the definition, and dispatch `DEFINITION_LOAD_DONE` 
7. Otherwise we dispatch `DEFINITION_LOAD_ERROR` with an appropriate payload.

`definitionLoad(id)` Action Creator allows us to cover the lifecycle of loading a definition whether off a local cache or a remote data source, and inform our reducers of its various cycles.

## Organizing Redux — The Ripe Method
Let's talk about how we should setup our Redux store.

We basically need two things:
1. Compose our reducers, and
2. configure our store with any additional functionality we'd like to have. Like Redux Thunk, or a logger or a time-machine like functionality that will allow us to rewind our state change-by-change. This also happens.

### Composing our reducers
We'd like to have one main reducer for our app, so we gather all reducers we need and combine them together:
*/src/store/index.reducer.js*
```
import { combineReducers } from 'redux';
import { reducer as noInternetReducer, default_state as no_internet_default_state } from '../Components/NoInternet/index';
import { reducer as app_reducer, default_state as app_default_state } from '../Components/App/index';
import { reducer as definition_reducer, default_state as definition_default_state } from '../Components/Definition/index';
import { reducer as route_reducer, default_state as router_default_state } from '@chegg/chegg-react-router';

// This is our default application state in all its glory
export const default_state = {
    no_internet : no_internet_default_state,
    app : app_default_state,
    current_definition : definition_default_state,
    router : router_default_state
};

// This is our main application reducer
export const reducer = combineReducers({
    no_internet : noInternetReducer,
    router : route_reducer,
    app : app_reducer,
    current_definition : definition_reducer,
});
```

As you can see we use previously defined branches and their reducers to compose our main state and reducer. This file will usually reside in `src/store/index.reducer.js`, but more on the file structure later.

### Setting Up The Store
In a similar fashion ...
```
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'; // Redux Thunk connector
import logger from 'redux-logger'; // Redux logger connector — extremely useful for development
import { reducer, default_state } from './index.reducer.js'; // Our main default state object and main reducer function

// Connect middleware
const createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    applyMiddleware(logger)
)(createStore);

// Configuring our store with the default state and the main reducer
export default function configureStore(initialState = default_state) {
    return createStoreWithMiddleware(reducer, initialState);
}
```

And we have our `src/store/initStore.js`

Now we need a way to pass our store to our React components.

### Connecting to React
This is how our React components will stack:
|
|→ Root
   |→ App
      ├ React-Router (to map components according to the current application route)
      ⎣ app components
      
*/src/Components/Root/Root.js*
```
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from '../App/App';

class Root extends Component {
    render() {
        return (
		        // Provider will make the store available to other components
            <Provider store={this.props.store}>
                <App />
            </Provider>
        );
    }
}

export default Root;
```      
      
In our main `/index.js` file we do the following to start it all:
```
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Components/Root/Root';
import initStore from './store/initStore';

global.init = function init(){
    const store = initStore();
    ReactDOM.render(<Root store={store} />, document.getElementById('CheggAppRoot'));
};

global.init();
```

That's it. Later on we'll setup our history management for our router and connect other modules that listen to the state.

So let's talk about our actual components.

## Component Fun
First lets establish a baseline for our understanding of React components:
1. React components receive parameters as an interface to the "outside world".
2. React components have a life cycle, and you can intervene in its life cycle for your purposes.

Using Redux you can create connected components. Meaning that you can wire the props that your component receives directly to specific branches of the application state. State changes — Component reacts. This way you don't have to initialise the components with explicit properties passed down to the component by its parent. 

In our component file we define both the connected and the "dumb" component, in order for us to be able to use our components in both ways when required. Unit tests is a good example of using the "dumb" component and pass to it whatever props we need to test it.

This is how we define components:
```
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { definitionLoad } from '../Definition/definition.actions'; // an action creator for Definition load

export class NoInternet extends Component {
    render(){
	    if (this.props.show) {
		    ... // some magical code
		    // and just some example 
		    this.props.definitionLoad(this.props.retry);
			} 
		}
}

// mapStateToProps is used here to map state branches to component properties. E.g.: `show` prop is mapped to `state.no_internet.show`. 
export function mapStateToProps(state) {
    return {
        show : state.no_internet.show,
        retry : state.no_internet.retry_definition_id,
        online : state.app.online,
        definition_state : state.current_definition.status
    }
}

// connect() is a redux utility that simply wraps our component with a state-sensitive wrapper. We also pass our action creator to be passed as a property and used in Redux context. For more see React-Redux documentation.
export default connect(mapStateToProps, { definitionLoad })(NoInternet);
```

We export both the Component Class and the connected component as a default.

### Component Ecosystem
We would really like to see our components as a centrepiece in a context of an ecosystem of its various helpers. The structure of this ecosystem is dictated by our desire to create logical capsules that make sense both together and in a context of the entire project. Also our "capsules" are easily reusable and extensible. 

Let's consider what we have:
* The Component itself
* Component related action creators file
* Component related reducer
* Component related API helper
* Component's SASS file
* Component related data matchers (more on this later)
* Component related tests

How does it look:
/Screen Shot 2018-08-27 at 14.29.33.png
|→ src
   |→ Components
      |→ Definition
	       ├➕ _ _ tests _ _
	       ├ Definition.js
	       ├ Definition.scss
	       ├ definition.actions.js
	       ├ definition.reducer.js
	       ├ definition.api.js
	       ├ definition.matchers.js
	       ⌊ index.js

> 👉 At this stage I'd like to make a side note, and say that our Ripe boilerplate has a script to generate this capsule automatically and link the appropriate files together.

To have a deeper look at what we have here let's look at the `index.js` file that is used as kind of an interface between the Definition "capsule" and the outside world.

```
import * as actions from './definition.actions';
import reducer, { default_state } from './definition.reducer';
import matchers from './definition.matchers';
import ConnectedDefinition, { Definition } from './Definition';

export {
    reducer,
    actions,
    default_state,
    matchers,
    Definition
}

export default ConnectedDefinition;
```

So by including `'/src/Components/Definition/index'` you are getting it all, if you need it. An example of this we'd seen already in our `/src/store/index.reducer.js` file:
```
import { combineReducers } from 'redux';
import { reducer as noInternetReducer, default_state as no_internet_default_state } from '../Components/NoInternet/index';
import { reducer as app_reducer, default_state as app_default_state } from '../Components/App/index';
import { reducer as definition_reducer, default_state as definition_default_state } from '../Components/Definition/index';
import { reducer as route_reducer, default_state as router_default_state } from '@chegg/chegg-react-router';

export const default_state = {
    no_internet : no_internet_default_state,
    app : app_default_state,
    current_definition : definition_default_state,
    router : router_default_state
};

export const reducer = combineReducers({
    no_internet : noInternetReducer,
    router : route_reducer,
    app : app_reducer,
    current_definition : definition_reducer,
});
```

Going on ...

## Routes, Routing & What's In Between
In Ripe we user react-router with a twist. We will not touch [react-router](https://github.com/ReactTraining/react-router/tree/v3/docs) specs in this document, which we recommend that you get acquainted with. 

[chegg-react-router](https://bitbucket.cheggnet.com/projects/EB/repos/chegg-react-router/browse) is simply some utility that can be used alongside react-router. We'd added some meaningful additions that we'll discuss shortly.

### Setup
The setup is outlined in the project's docs, and here we'll touch only what is necessary for our purposes.

**Step 1.** After initiating you store you should connect the router to Redux:
```
import { createBrowserHistory } from 'history';
import { connect } from '@chegg/chegg-react-router'
// ... init store code
connect(createBrowserHistory(), store);
```

or in our example:
*/src/index.js*
```
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Components/Root/Root';
import initStore from './store/initStore';
import { default_state } from './store/index.reducer';

import { createBrowserHistory } from 'history';
import { connect } from '@chegg/chegg-react-router'

global.init = function init(){
    const store = initStore();
    const history = createBrowserHistory();
    connect(history, store);

    ReactDOM.render(<Root store={store} />, document.getElementById('CheggAppRoot'));
};

global.init();
```

**Step 2.** Setup router reducer to become an integral part of your app's state management:
*/src/store/index.reducer.js*
```
import { combineReducers } from 'redux';
import { reducer as noInternetReducer, default_state as no_internet_default_state } from '../Components/NoInternet/index';
import { reducer as app_reducer, default_state as app_default_state } from '../Components/App/index';
import { reducer as definition_reducer, default_state as definition_default_state } from '../Components/Definition/index';
// Here it is!👇
import { reducer as route_reducer, default_state as router_default_state } from '@chegg/chegg-react-router';

// This is our default application state in all its glory
export const default_state = {
    no_internet : no_internet_default_state,
    app : app_default_state,
    current_definition : definition_default_state,
    router : router_default_state \\ 👈 Here 
};

// This is our main application reducer
export const reducer = combineReducers({
    no_internet : noInternetReducer,
    router : route_reducer, \\ 👈 and here
    app : app_reducer,
    current_definition : definition_reducer,
});
```

Notice how the router becomes a part of our Redux operation:
1. we add a `router` branch to our state tree, and
2. add a `router` reducer to affect this state branch as a result to router actions.

**Step 3.** We plug the router in our `/src/Components/App.js`:
```
import React, { Component } from 'react';
import { Router, getHistory } from "@chegg/chegg-react-router";
import { connect } from 'react-redux';

import { getRoutes } from '../../modules/routes';
import { setMatchers, resetMatchers } from "@chegg/chegg-react-base/utils/dataFetcher";

import NoInternet from "../NoInternet/NoInternet";

import './App.scss';

class App extends Component {
    render() {
        return (
            <section className={`App`}>
	            <Provider value={
		            { 
			            onRouteChange : (props, match) => this.onRouteChange(props, match) 
				        }
			        }>
                <Router history={ getHistory() }/>
	                { getRoutes() }
                </Router>
                <NoInternet />
            </section>
        );
    }
    
    // provided by the boilerplate for data matchers 
    // if you use them, if not use this function for 
    // your other needs to intercept route change event
    onRouteChange(props, match){
        if (match.dataMatchers) {
            setMatchers(match.dataMatchers);
        } else {
            resetMatchers();
        }
    }
    ...
```

First let's look the Router setup: it's wrapped with it's provider to allow access to `onRouteChange`, and manage our `matchers` (for example, or other uses). (Provider will just pass a specific change to its consumers.)

But first let's see how we declare our routes:
*/src/modules/routes.js*
```
import Definition, { matchers as definition_matchers } from '../Components/Definition/index';
import { CheggRoute } from '@chegg/chegg-react-router';

export {
	getRoutes
}

function getRoutes() {
	return [
		<CheggRoute 
			name='definition' 
			path={definition/:id} 
			component={Definition} dataMatchers={definition_matchers} // optional
		 />,
		...
		// more routes if you have any
	];
}
```

Ok so `CheggRoute` is a component replacement for react-router's `Route`. Among other things `CheggRoute` allows us to have several enhancements:
1. named routes — gets very useful at times,
2. data matchers — allow to execute code upon route change.

See more in the project [documentation](https://bitbucket.cheggnet.com/projects/EB/repos/chegg-react-router/browse).

### Data Matchers
Imagine that you'd like for some jobs to be done upon route change. For example to load a definition content from GraphQL once a new definition is being loaded (http://<app>/definition/<id>). In order to do this you may register 'data matchers' for a specific route. See previous code snippet — `data_matchers` variable for Definition is configured like this:
*/src/Components/Definition/definition.matchers.js*
```
import * as actions from './definition.actions';
export default [
    {
        matcher : (state, prevState) => {
		    // a matcher for a changed id parameter in the route
            if (state.router.params.id == prevState.router.params.id) return false;
            return true;
        },
        action : (dispatch, state) => {
            // if matched, i.e. id changed in the route, 
            // fire some Redux action — in our case load a 
            // definition with the specified (in the route) id
            dispatch(actions.definitionLoad(state.router.params.id));
        }
    },
    // more cases if you need.
]
```

You may add as much matchers as you want and connect them to the relevant routes inside `/src/modules/routes.js`.

This is a recap of specificities of Chegg-React-Router, and you don't need to install any additional packages to have access to this module — it's included in the Ripe Boilerplate, which we'll discuss later in this document.

## Connected Modules
We'd like to briefly touch on how you should connect various logical modules to Redux.

There are times when you have pieces of code you'd like to be able to interact with your Redux store, say for dispatching an action or accessing the app state. How would you go about it? Here's a simple template for the `connect`.

Let's look at a simple example:
*/src/modules/online.meter.helper.js*
```
import { APP_OFFLINE, APP_ONLINE } from '../Components/App/app.actions';

export {
    connect,
    init
}

let _store;

function connect(store) {
    _store = store;
}

function init(onlineHandler = defaultOnlineHandler, offlineHandler = defaultOfflineHandler) {
    window.addEventListener('online',  onlineHandler);
    window.addEventListener('offline', offlineHandler);
}

function defaultOnlineHandler() {
    _store.dispatch({ type : APP_ONLINE });
}

function defaultOfflineHandler() {
    _store.dispatch({ type : APP_OFFLINE });
}
```

Simply having a `connect(store)` API to create a local reference for further use. Like in the example above. And of course the actual connection happens after you have initiated your store.

*/src/index.js*
```
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Components/Root/Root';
import initStore from './store/initStore';
import { default_state } from './store/index.reducer';
import { createBrowserHistory } from 'history';
import { connect } from '@chegg/chegg-react-router'

import { connect as onlineMeterConnect, init as onlineMeterInit } from "./modules/online.meter.helper";


global.init = function init(){
    const store = initStore();
    const history = createBrowserHistory();
    connect(history, store);
    
    onlineMeterConnect(store);
    onlineMeterInit(); // we also initialize this piece of code, you can do it wherever in your code.

    ReactDOM.render(<Root store={store} />, document.getElementById('CheggAppRoot'));
};

global.init();
```

## The Ripe Boilerplate
All of this goodness and more is tightly packaged inside our handy boilerplate. All you need is to initiate it, just like you'd do with the [create-react-app](https://github.com/facebook/create-react-app) and then just add your own code in all the Ripe places. Let's go over it step by step.

**Step 1.** Install create-react-app, preferably a global install for convenience.
```
npm install -g create-react-app
```

**Step 2.** Create your new Chegg app using The Ripe react-scripts — [chegg-react-app](https://bitbucket.cheggnet.com/projects/MB/repos/create-react-app/browse):
```
npm set registry 'http://npm-registry.test.cheggnet.com/'

create-react-app chegg-new-project  --scripts-version @chegg/react-scripts
```

**Step 3.** Some configurations notes: 
1. Webpack config can be modified in `/config-override.js` — preset by the boilerplate, where:
* `config` is the current config
* `css_include_paths` is an array of paths to include in the scss configuration. Note — these will not auto-include — this will simply make them accessible through `@import` statements in your `SCSS` files. This will by default  include paths to `compass` and `sunkist_css` (installed by The Ripe Boilerplate).
* `onBuildComplete(postBuildTask)` — runs after a `create-react-app` preset build was complete.

**Step 4.** Useful scripts:
### Create
Will create a component scaffolding with files and connections set up in a basic way.
```
npm run create ComponentName
```

This is what you'd get for `npm run create Definition`:
/Screen Shot 2018-08-27 at 14.29.33.png

And in addition the newly created Definition reducer will be integrated into app's state composition:
*/src/store/index.reducer.js*
```
import { combineReducers } from 'redux';
import { reducer as app_reducer, default_state as app_default_state } from '../Components/App/index';
import { reducer as definition_reducer, default_state as definition_default_state } from '../Components/Definition/index';
import { reducer as route_reducer, default_state as router_default_state } from '@chegg/chegg-react-router';

export const default_state = {
    app : app_default_state,
    definition : definition_default_state,
    router : router_default_state
};

export const reducer = combineReducers({
    router : route_reducer,
    app : app_reducer,
    definition : definition_reducer,
});
```

### Action
Adding a new Redux action and its connections is easy, and has 2 flavours:

**Simple**
```
npm run action ComponentName actionName
```

Say: `npm run action Definition definitionLoad` will add an action creator in `definition.actions.js`, export it, import it into `definition.reducer.js` and create a case for the action in the `reducer()`. Simply saying all the things you'd need to do when creating an action.

**Async**
```
npm run action ComponentName actionName async
```

This will create 3 actions - START, LOADED and ERROR
for this async action. Just like we have in our `definition.actions.js` above.

Please review the project's [documentation](https://bitbucket.cheggnet.com/projects/MB/repos/create-react-app/browse) in addition to this brief overview.

## Next 
to be continued ...