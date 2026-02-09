# **Uversity Player Frontend Architecture**

A Case for Redux in Rich Client-Side Applications

![](_page_0_Figure_2.jpeg)

- Motivation
- Introduction
- Requirements
  - o Product Requirements
- Functional Requiments
- Traidoffs
- Decisions
- The Method
  - o The Main Principles
  - o Separating Concerns For Refactor
  - o Unidirectional Application Information Flow
  - o Keeping It Dumb
  - o One Application State
  - o Declarative Application Logic
- Implementation Detail
  - o File Structure
  - o Components
  - o Store
    - § Reducer File
    - § Actions File
    - § API

- § Queries
- § Selectors
- § Logic
  - § Logic implementation
- Using Redux Toolkit
  - o Setting up store
  - o Defining State Branches (Slices)
    - § Reducer File
    - § Actions
    - § Selectors
    - § Logic Listeners
    - § The Connect Pattern for Non-User-Generated Actions

# **Motivation**

This document aims to provide a clear perspective on why our chosen architecture is the best for us to build Uversity Player as a nimble platform for growth in both features and usage across various Chegg channels.

We use this document both as a retrospective on our best practices, and e look into the future of a growing product.

In addition, we would like to use this document as a transparent manifesto sharing our way of thinking. Sharing the ways we use industry-standard tools to achieve easily scalable rich clientside applications.

# **Introduction**

We — the Hackworth frontend engineering team — write this document to reflect and share our architecture. It should be obvious that the choice of architecture should be optimally aligned with the goal of your product. Products, in turn, if successful tend to evolve, and should evolve. Thus the right architecture should allow us to grow and change the product easily … across teams and across times.

Our product is a rich client-side app. Imagine Chegg eReader. eReader is a complex product, it implements a vanila.js document renderer and a React app that runs the renderer in an iframe via a JS bridge. The React app also manages all of the UX: manipulating and navigating "live" textbooks to the precision of a character, managing UGC in form of highlights, notes, bookmarks etc., adding layers of attached Chegg products like TBS & Q&A, in textbook search etc.

Here's a simple way of describing eReader's architecture:

#### [From [The Story of eReader\]](https://chegg-my.sharepoint.com/:u:/p/yehuda/EYtT6G-D4MBHkbBjgFqU6bEBR2Ki-1RcUkIbGs7AUq31IQ?e=qQIkVq)

eReader — as a web app is ready from inception to be embedded inside Native applications. The Viewer (see above) is wrapped by a native iOS or Android App, that communicates with the Viewer via the Bridge (see figure above).

We are happy to report that we had successfully built eReader from scratch, shipped it, and later added many different features — quickly and easily in spite of changes in our team, that have an almost total change in team members. New team members started working on ereader in different stages of its lifetime. We praise our architecture for a significant part of our success.

So it happens that this is not the first document we write to share our method. Some 4 years ago Chegg engineering adopted one architecture across teams, we wrote The Ripe Method Manifesto explaining how we work with React — a method that worked for us nicely for rich client-side apps, (optimized for offline operation and sync with mobile devices, see some of Flashcards+ Web tech designs for example).

One of our main motivators for sharing was that there were many different architectures that just didn't scale, and many developers were getting stuck. React was misused.

A lot of things changed since then, a ton of stuff got better, but our method remained valid and improved.

Today, after improving greatly with Chegg architecture best practices, and eReader as a working model, we want to have an overview of what we have, and look into the future. The focus for this introspection will be the Uversity Player.

# **Requirements**

## **Product Requirements**

# **Functional Requiments**

# **Traidoffs**

# **Decisions**

How requirements are achived via the chosen method.

# **The Method**

This document will concentrate on how we build the App part.

I will not go in too much depth here, only mark the most important stuff. The reader may interpret the main ideas as they see fit for their project.

## **The Main Principles**

- 1. **Separate concerns** in such a way so that code can easily be replaced/refactored for one concern without touching others.
- 2. **Unidirectional application message flow** let application declaratively state about what's going on — a button was clicked, a payload came from a server, a window was resized, a URL was changed, a message came from the Bridge, etc.
- 3. **Keep stuff as "dumb" as possible** this means that there should be no logic in components (and action and reducers) for example.
- 4. **One application state** no private components state all components are connected to one state and consume it through component props. Even simplest state changes like toggling an element view will affect the global application state, and not be managed inside the component itself.
- 5. **Managing application logic declaratively** all application logic is managed separately (#1) and declaratively in a way it responds to application messages (#2).

Let's unpack it one by one and see how we manage these.

## **Separating Concerns For Refactor**

This one is fairly simple, so let's touch the crux: your application and its components will change! By clearly separating its various logical parts we plan the inevitable change. This way we also keep to ourselves the option to change some things in future.

A simple example is API calls — create an interface and behind it implement your chosen way of connecting to your APIs — the APIs may change, but the interfaces will remain.

Another example is your business logic — don't distribute it across your components (via, say hooks), rather concentrate it in "logic" files that react to application actions.

Think of drivers for different tasks — different drivers can be used interchangeably with the same interface.

## **Unidirectional Application Information Flow**

Here we assume that our application generates pieces of information — messages — declaring what has just happened. It can be a user-generated event, or server-generated event, or some other background process or async action that has reached its conclusion, and now would like to declare: "I have finished with this result", or "I have failed this task because of this or that".

Thinking in these terms frees us from getting tangled up with application logic. We just declaring who shouts what and when. And thus define the application lifecycle.

Information flowing in one direction will ultimately affect the application state (and reactive view in turn). In addition, we have the ability to know about everything that is happening in the app by listening to the described message flow.

We may be familiar with this paradigm from Facebook's Flux, which was quickly adopted and improved by Redux.

## **Keeping It Dumb**

A rule of thumb to keep it dumb. It means: less logical — more declarative. Example: I don't care what will happen if I press this button, I only care to declare that a button was clicked. Elsewhere logic will be considered and acted upon according to #1 — separation of concerns.

When things are dumb we gain a lot of maintainability and reusability, not to speak of testability. Example: components only render UI and call actions, reducers only and straightforwardly change their state, actions only specify their message and payload (opposite of how Thunk works), etc.

## **One Application State**

One state to rule them all and in the darkness bind them. Or so they say. But seriously: one is all you need!

Your application state represents all of the different branches of your app, and is managed in one place. Reactive UI can subscribe to any subset of it as props, and may call actions that may change any part of it.

We have found that managing private component states becomes unbearable for maintenance and hides the logic of the application inside components. And other unpleasant side effects. Unless you have a form inside your component you shouldn't have useState or equivalents inside.

The application state will contain all of the different state branches allowing compartmentalization, say:

```
{
 router: {...},
 book: {...},
 highlights: {...},
 layout: {...},
 toc: {...},
 ...
}
```

Please note, that even if we have a state for toggling some internal context menu, we will manage it inside the global application state.

So if we manage a drawer with a list of highlight items, we will manage a central list for their "internal state", like whether the specific item is collapsed or expanded, or is in edit mode etc.

```
{
 ...
 notes_highlights_menu : {
 items: [...],
 context: {
 item_id : {
 expanded: boolean,
 some_internal_menu_show: boolean,
 is_in_edit_mode: boolean,
 ....
 },
 ...
 }
 }
}
```

In terms of managing UI — it's a no-brainer since React will listen to the appropriate subset of the state. However, once you need to have access to this information — you have a quick and easy way to know what's up from one source of truth.

This approach proved its worth for years in different applications.

## **Declarative Application Logic**

Declaring our logic works like IFTTT — If This Then That — we react to actions/messages going off in our application and performing whatever logic we need, and then firing off other actions/messages declaratively.

Example: if highlightsOpen action/message was dispatched, Then:

- dispatch highlightsFetch (so we can display a loading UI),
- fetch highlights from the server
- after fetch is successful dispatch highlightsLoadSuccess with highlights as a payload, also execute a bridge command to notify the viewer
- if fetch failed dispatch highlightsLoadError

The above lines define a logic function for Highlights to manage their load when it's required. It declares what needs to be done in case highlightsOpen happens.

Pay attention: these logical bits do not alter the state. Only reducers do that. But these "logics" may dispatch whatever actions are needed, which themselves can be reacted upon by different "logics".

Thus, we can manage logic separately — as a type of configs — IFTTT, and group them according to different parts of the application: book, highlights, layout, etc. (reflecting the different state branches).

# **Implementation Detail**

How we make it work in general, and then how we'd like to actually implement it for Uversity Player.

By now you might have guessed that we chose Redux to allow us to implement points #2, #4 and by extension #5 of our main principles. Namely:

- having a unidirectional information flow in the app,
- having one state one application-wide source of truth,
- and being able to use these properties of our architecture to write declarative logic.

The rest just falls in place.

## **File Structure**

There're so many ways to manage your code, even if you'd chosen a tool like Redux it will still give you almost unlimited freedom … to make grave mistakes.

We found that compartmentalization of concerns starts with how you organize your files. And it's a good exercise to imagine your project in a year or five in the future through the file organization prism.

Let's look at it up close. We have:

- 1. React Components
- 2. Store Management
- 3. Various Other Modules

## **Components**

Much like Chegg's best practices, we'll have the following files in a specific component folder:

```
∟ Components
 ∟ ComponentA
 ├ __tests__
 ├ ComponentA.tsx
 ├ styled.ts
 ├ types.ts
 ├ index.ts
 ⌊ ComponentA.stories.tsx
 ∟ ComponentB
 ...
```

## **Store**

While the store is configured once and in one place, we want to have discrete state branch management. We'll organize state branch folders to have their basic elements defined separately for clarity:

```
∟ store
 ∟ branch_a
 ├ __tests__
 ⌊ queries
 ├ create.gql.ts
 ├ fetch.gql.ts
 ⌊ remove.gql.ts 
 ├ branch_a.actions.ts
 ├ branch_a.api.ts
 ├ branch_a.reducer.ts
 ├ branch_a.selectors.ts
 ├ branch_a.listener.ts
 ⌊ types.ts
 ∟ branch_b
 ...
 ...
├ index.reducer.ts
├ store.ts
⌊ types.ts
```

Let's dissect the above structure.

We adhere to principle #1 — separation of concerns — and group the different aspects of state management separately. However, tools like RTK allow you to define both reducers, actions, and query management together — we'd like to segregate them here into different logical parts.

Your state branch might not require all of the above files. However, you'll always start with: reducer, actions, types files.

### **Reducer File**

Here we define the default state of the branch and its reducers. Reducers should be declarative, containing no logic. This file may contain utility functions for formatting content for example.

### **Actions File**

Actions — are declarations of an event happening in our application. We'd also refered to them previously as "messages".

Simple declarative actions will be concentrated in the .actions.ts file. (We want to have one reference point for actions.)

Here's an example of an actions file as we managed it inside Chegg eReader:

```
import { ActionType, createAction } from "typesafe-actions";
// orderly defined action payload types
import {
 CreateBookmarkActionPayload,
 RemoveBookmarkActionPayload,
 UpdateBookmarkIdPayload,
 BookmarksFetchedPayload,
} from "./types";
// action are just declarations
export const CREATE_BOOKMARK = "bookmarks/create";
export const REMOVE_BOOKMARK = "bookmarks/remove";
export const REMOVE_BOOKMARKS_FOR_LOCATION = "bookmarks/remove all for 
current location";
export const FETCH_BOOKMARKS = "bookmarks/fetch";
export const BOOKMARKS_FETCHED = "bookmarks/fetched";
export const BOOKMARKS_LOAD_ERROR = "bookmarks/load error";
// define simple declarative actions using Typesafe Actions lib
export const createBookmark = createAction(
 CREATE_BOOKMARK, // action type
 (action) => (payload?: CreateBookmarkActionPayload) => action(payload || 
{})
);
export const removeBookmark = createAction(
 REMOVE_BOOKMARK,
```

```
 (action) => (payload: RemoveBookmarkActionPayload) => action(payload)
);
export const bookmarksFetched = createAction(
 BOOKMARKS_FETCHED,
 (action) => (payload: BookmarksFetchedPayload) => action(payload)
);
// some action have no payload
export const removeBookmarksForLocation = 
createAction(REMOVE_BOOKMARKS_FOR_LOCATION);
export const fetchBookmarks = createAction(FETCH_BOOKMARKS);
export const bookmarksLoadFailure = createAction(BOOKMARKS_LOAD_ERROR);
// easier for export and typing
export const bookmark_actions = {
 createBookmark,
 removeBookmark,
 removeBookmarksForLocation,
 fetchBookmarks,
 bookmarksFetched,
 bookmarksLoadFailure,
};
// export action types
export type BookmarkActionTypes = ActionType<typeof bookmark_actions>;
```

This file encapsulated actions. The only function of action functions is to be "dispatched" by the Store.

RTK allows a different implementation for action and reducers — we'll address it below.

### **API**

.api.ts files are to contain simple functions to handle API calls, formating of results to suit application needs, and error handling. The API files are to contain implementation methods used to communicate with whatever backend is chosen. This way if the backend changes in any way — the change is contained within .api.ts file while its interface remains unchanged.

Let's look at a simple example from the eReader

```
// implementation detail for Q&A search
import { QnaSearchApiParams, QnaSearchApiResponse, QnASearchResult } from 
"./types";
import {
 studySearch, studySearch_studySearch_study,
 studySearchVariables
} from "@src/generated/graphql";
import { getClient, addGqlRoute } from "@chegg-web-tools/with-chegg";
import search from "./queries/search.gql";
import { getConfig } from "@modules/config";
const CONTEXT_KEY = "qna-search";
const url = getConfig("attach_gql_server");
addGqlRoute(CONTEXT_KEY, url);
```

```
// this is the API signature for Q&A search, 
// and will not change even if the implementation changes
export async function getQnaSearchResults(params: QnaSearchApiParams): 
Promise<QnaSearchApiResponse> {
 const { data } = await getClient().query<studySearch, 
studySearchVariables>({
 query: search,
 variables: {...params},
 context: { [CONTEXT_KEY]: true },
 });
 if (!data) {
 throw new Error("Something went wrong");
 }
 return processResponse(data.studySearch!.study!);
}
// If needed normalize server results for the consumption by the app — a 
server-client filter
function processResponse(data: studySearch_studySearch_study): 
QnaSearchApiResponse {
 data.docs!.forEach((result: any) => {
 if (!result) return;
 results.push({
 title: result.title || "" ,
 question: result.question || "",
 url: result.url || "",
 id: result.id || "",
 })
 });
 return {
 page : data.start! + 1,
 total: data.numFound || 0,
 nextPage: data.nextPage || null,
 previousPage: data.previousPage || null,
 results
 }
}
```

In the above example, you may observe that we use GraphQL and Apollo client for BFF communication. These are implementation details that we'd like to conceal in the .api.ts file. These things may change in the future, or some aspect of them may change. However, the interface of the API to our application should not change. The interface being: export async function getQnaSearchResults(params: QnaSearchApiParams): Promise<QnaSearchApiResponse>

### **Queries**

We also separate the query files for GraphQL inside queries folder and import them into api files, see lines: #8 & #19

```
import search from "./queries/search.gql";
```

```
...
const { data } = await getClient().query<studySearch, studySearchVariables>({
 query: search,
 variables: {...params},
 context: { [CONTEXT_KEY]: true },
});
```

The inside of your query file should match the implementation detail. We use GraphQL so it'll look something like this:

```
import { gql } from "apollo-boost";
export default gql`
 query studySearch(
 $query: String!, 
 $page: Int!
 ) {
 studySearch(query: $query, page: $page
 ) {
 study {
 docs {
 ... on SearchResultQna {
 id
              title
              url
              question
 }
 }
 numFound
 limit
 start
 nextPage
 previousPage
 }
 }
 }
`;
```

In our experience, the above separation allows us to be agile, and quickly find the exact code we're looking for just where it's supposed to be.

### **Selectors**

When writing a UI-heavy client-side applications performance is important. Many times performance upgrades will come in a form of pre-processing instead of real-time processing of data that will determine what to show on the screen. Using Redux allowed us to improve the performance of our app by the use of selectors.

Selectors allow querying our application state, cache the results, and re-query automatically only when specific state branches change. Since we use subsets of our state to feed our components with props, this optimization is very handy.

In the past we used Reselect library for Selectors, but it is olso possible to use RTK built-in selectors. More on this below.

### **Logic**

Finally, we reach logic management of a specific state branch. What should we expect to find in the logic file? Firstly, you may not need a .logic.ts file for your state branch at all. After all some times it's enough to dispatch an action to change the state with a reducer. So logic files are used for additional logic you might have.

How does it work?

We manage our logic files using a pub/sub pattern with the store. If an acton is dispatched we'd like to perform some logic. That's it.

In addition, we "arm" our logic function with the ability to access the state, and dispatch other actions if necessary.

So it's enough to fire an action declaring that Bookmarks need to be fetched in order for us to execute the fetching logic and whatever's related to it. Let's look at an pseudo code example:

```
import { fetchBookmarks } from './bookmarks.api';
addListener({
 action: fetchBookmarks,
 (store, action) => {
 const state = store.getState();
 const dispatch = store.dispatch;
 // fetching isbn from the state using a custom selector
 const isbn = getIsbn(state);
 try {
 //
 const bookmarks = await fetchBookmarks(isbn);
 dispatch(actions.bookmarksFetched({ bookmarks }));
 } catch (e) {
 dispatch(bookmarksLoadFailure());
 }
 }
});
```

The above is a simple use case. But you can manage a much more complex logic if your project requires.

I'd like to bring forward an example from eReader, when we create a piece of UGC on the client optimistically — with a temp ID, and in the background create a real asset on the server, and when server update is successful we switch the temp ID with the real ID in the background.

```
addListener({
 action: createBookmark,
```

```
 (store, action) => {
 ...
 try {
 const { id } = await api.createBookmark(action.payload);
 dispatch(updateBookmarkId({
 old_id: action.payload.id, 
 new_id: id
 }));
 } catch(e) {
 dispatch(actions.BookmarkAddError());
 dispatch(
 addNotification({
 type: notification_types.error,
 label: i18n('notifications.highlights.errors.add'), 
 }))
 }
})
```

You may also subscribe to actions that are originated from a non-user interaction events, like background local storage sync events, or Bridge events (eReader), or window resize, or internet connection events etc.

#### **Logic implementation**

You may write your own middleware to implement the pub/sub pattern. We had previously used the Redux Logic library but decided to part with it due to its size.

Currently, we're aiming to use RTK's [action listener middleware](https://github.com/reduxjs/redux-toolkit/discussions/1648) that is written expressly for this purpose and is [small](https://bundlephobia.com/package/@rtk-incubator/action-listener-middleware@0.8.0) and convenient.

Action Listener Middleware has become a part of RTK 1.8 as of 2 Feb 2022.

# **Using Redux Toolkit**

In our opinion — Redux Toolkit — is the best tool out there to encompass all the significan uses for Redux in general, and allow us to manage our architecture in particular.

Refer to RTK documentation for mor information [https://redux-toolkit.js.org/usage/usage-with](https://redux-toolkit.js.org/usage/usage-with-typescript)[typescript](https://redux-toolkit.js.org/usage/usage-with-typescript)

It is also important to note, that RTK — is a toolkit! It is unopinionated by definition. Hence our opinionated approach should use whatever useful tools and patterns from RTK, and "ditch" others. It is very easy to get tangled by various "shortcuts" that RTK suggests, but the same shortcuts turn into hindrances quicker than one can imagine.

Below we'll give examples of how we use RTK.

## **Setting up store**

We use the default flavor of creating the store — using the default middleware setup & adding our reducers.

The default middleware in this case would be:

#### **Development**

```
const middleware = [thunk, immutableStateInvariant, 
serializableStateInvariant]
```

#### **Production**

```
const middleware = [thunk]
```

It is possible that we'll even part with thunk middleware in future, since we'll use RTK's action listener middleware.

So, our entire config will look like this:

```
const store = configureStore({
 reducer: rootReducer,
})
```

## **Defining State Branches (Slices)**

Somehow "branch" is a better suiting name than a slice, meaning that if you'll remove a slice than the state isn't whole anymore, while removing a branch is something that can easily happen. And this metaphor is more suiting an architecture that should allow agility. Ok, semantics aside let's dig it.

We want to simply declare what are:

- 1. branch initial state
- 2. simple reducers
- 3. simple actions whether they have reducers or not

We want to group actions together and export the reducer, actions, and types.

### **Reducer File**

Reducer file is responsible to contain:

- 1. Initial branch state
- 2. Available reducer declarations

Here's an example of bookmarks branch located inside a /store/bookmarks/ folder:

#### **bookmarks.reducer.ts**

```
import { createReducer } from '@reduxjs/toolkit'
import { LoadingStates } from '@src/.../constants'
import { BookmarksState } from './types' // <- bookmarks (store) types
import { 
 bookmarksFetch, 
 bookmarksFetched,
 bookmarksError,
 bookmarksAdd
} from './bookmarks.actions.ts' // <- the actions we use 
// default state
export const defaultState: BookmarksState = {
 loading: LoadingStates.IDLE,
 by_id: {},
 order: []
}
export const reducer = createReducer(defaultState, (builder) => {
 builder
 .addCase(bookmarksFetch, (state) => {
 state.loading = LoadingStates.LOADING
 })
 .addCase(bookmarksFetched, (state, action) => {
 state.loading = LoadingStates.SUCCESS;
 state.by_id = {...action.payload};
 state.order = Object.keys(action.payload);
 });
 .addCase(bookmarksError, (state) => {
 state.loading = LoadingStates.ERROR;
 })
 .addCase(bookmarksAdd, (state, action) => {
 state.by_id[action.payload.id] = action.payload.bookmark;
 state.order.push(action.payload.id);
 })
 ...
 .addDefaultCase((state, action) => {});
});
```

That's it. The initial state and simple, declarative reducers **without** logic.

You might have noticed that we import the bookmarks action creator functions. Let's see how they are defined.

One more thing. Although RTK recommend using the builder callback notation, there's also a slimmer way:

```
export const reducer = createReducer(defaultState, {
 bookmarksFetch: (state) => {
 state.loading = LoadingStates.LOADING
 },
 bookmarksFetched: (state, action) => {
 state.loading = LoadingStates.SUCCESS;
```

```
 state.by_id = {...action.payload};
 state.order = Object.keys(action.payload);
 },
 bookmarksError: (state) => {
 state.loading = LoadingStates.ERROR;
 },
 bookmarksAdd: (state, action) => {
 state.by_id[action.payload.id] = action.payload.bookmark;
 state.order.push(action.payload.id);
 },
 ...
});
```

[See createReducer docs on RTK website](https://redux-toolkit.js.org/api/createReducer)

### **Actions**

We will use only simple, declarative action creators — no thunk (ever, we have no need for thunk).

```
import { createAction } from '@reduxjs/toolkit'
import { 
 BookmarksFetchedPayload, 
 BookmartksErrorPayload, 
 BookmarksAddPayload 
} from './types' // <- bookmarks (store) types
export const bookmarksFetch = createAction('bookmarksFetch');
export const bookmarksFetched = 
createAction<BookmarksFetchedPayload>('bookmarks/fetched');
export const bookmarksError = 
createAction<BookmartksErrorPayload>('bookmarks/error');
export const bookmarksAdd = 
createAction<BookmarksAddPayload>('bookmarks/add');
// (optional) an aggregate of all bookmark actions 
export const actions = {
 bookmarksFetch,
 bookmarksFetched,
 bookmarksError,
 bookmarksAdd
}
// (optional) aggregate action type
export type BookmarksActionTypes = typeof actions; // not sure it's the 
correct syntax
```

[More info on `createAction` in RTK's docs](https://redux-toolkit.js.org/api/createAction)

### **Selectors**

Selectors — are standard Reselect selectors. We will use selectors in components therefore we don't need [SafeDraft selectors.](https://redux-toolkit.js.org/api/createSelector)

Selectors are useful for performance and can save tons of computing power for complex traversals in the state, or pre-calculations for non-real-time state fetching, or other uses you can think of. We do recommend using selectors.

An example code for bookmarks selectors from the eReader project:

```
import { createSelector } from 'reselect'; // in our case we use 
@reduxjs/toolkit
function getSections(state: RootState): Record<number, BookmarkID[]> {
 return state.bookmarks.by_section;
}
function getBookmarks(state: RootState) {
 return state.bookmarks.by_id;
}
// selector to traverse bookmarks (by book section) collection 
// and return a map of bookmarks organizes by section number 
export const getBookmarksBySection = createSelector(
 [getSections, getBookmarks],
 (sections, bookmarks) => {
 const result: Record<number, Bookmark[]> = {};
 for (let section in sections) {
 let sec = +section;
 result[sec] = sections[sec]
 .sort((current, next) =>
 compareBookmarks(bookmarks[current], bookmarks[next])
 )
 .map((id) => bookmarks[id]);
 }
 return result;
 }
);
```

### **Logic Listeners**

For our declarative logic, we use RTK's action listener middleware, (which is to become a part of ReduxJS toolkit). The idea is to match action, or several actions, and execute whatever application logic we need. We can also dispatch actions as a result of our logic function execution.

startListening API is fairly simple and is described in detail by RTK's team: <https://github.com/reduxjs/redux-toolkit/discussions/1648>

We register the middleware with predefined configs during the store creation. The configs contain logic declared by different state branch managers in our code, like the obe we have for bookmarks. Let's see how it looks:

#### **bookmarks.logic.ts**

```
export const bookmarksLogic = [
 {
 actionCreator: bookmarksFetch,
 effect: async (action, listenerApi) => {
 // listenerApi.unsubscribe() for the duration of the function 
(optional)
 try {
 const bookmarks = await fetchBookmarks(route_params.isbn);
 listenerApi.dispatch(bookmarksFetched({ bookmarks }));
 } catch (e) {
 listenerApi.dispatch(bookmarksError({ error: e }));
 }
 // listenerApi.subscribe()
 }
 },
 {
 actionCreator: bookmarksFetched,
 effect: (action, listenerApi) => {
 resetBookmarksIndicator(listener.getState(), listener.dispatch); 
 }
 },
 // an example from eReader:
 {
 actionCreator: setPageLoaded,
 effect: (action, listenerApi) => {
 const state = listenerApi.getState();
 if (state.book.type === 'pdf') {
 return;
 }
 // check if there's a bookmark on the loaded page
 const bookmarks: Bookmark[] = getEpubPageBookmarks(state, {
 start: action.payload.start_location,
 end: action.payload.end_location,
 dataIndexRange: action.payload.dataIndexRange,
 pathRange: action.payload.pathRange
 });
 if (bookmarks.length) {
 listenerApi.dispatch(setBookmarkIndicator(true));
 } else {
 listenerApi.dispatch(setBookmarkIndicator(false));
 }
 }
 }
]
```

All the different logic configs need to be registered with the startListening middleware at stpre configuration:

```
import { configureStore } from '@reduxjs/toolkit'
import { createListenerMiddleware } from '@rtk-incubator/action-listener-
middleware'
import { bookmarksLogic } from '@src/.../store/bookmarks/bookmarks.logic';
import { highlightsLogic } from '@src/.../store/highlights/highlights.logic';
import { bridgeLogic } from '@src/.../modules/bridge.logic';
```

```
// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();
// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
listenerMiddleware.startListening({
 ...bookmarksLogic,
 ...highlightsLogic,
 ...bridgeLogic,
 ...
});
const store = configureStore({
 reducer: rootReducer,
 // Add the listener middleware to the store.
 // NOTE: Since this can receive actions with functions inside,
 // it should go before the serializability check middleware
 middleware: (getDefaultMiddleware) =>
 getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
Also, pay attention to some TypeScript specific considerations: 
// listenerMiddleware.ts
import {
 createListenerMiddleware,
 addListener,
} from '@rtk-incubator/action-listener-middleware'
import type {
 TypedStartListening,
 TypedAddListener,
} from '@rtk-incubator/action-listener-middleware'
import type { RootState } from './store'
export const listenerMiddleware = createListenerMiddleware()
export const startAppListening =
 listenerMiddleware.startListening as TypedStartListening<RootState>
export const addAppListener = addListener as TypedAddListenern<RootState>
```

### **The Connect Pattern for Non-User-Generated Actions**

…