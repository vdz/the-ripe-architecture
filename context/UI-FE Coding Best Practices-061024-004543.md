# FE Coding Best Practices

- - This is a living document. To add or change something,
    - 1. Please open a ticket in the BADGER board
  - 2. This will trigger an architecture review of your request.
  - 3. Be ready to meet and discuss ( the amount is based on the request )
  - 4. Once clear of review, it will be added to this page.

The format of this document is to list a rule and then provide an example of good and bad usages. It's important to note that the rule itself is the main thing to focus on and the examples are meant to give an additional insight but aren't expected to cover every possible example

- [General Style Guide](#page-1-0)
  - [Casing](#page-1-1)
  - [Semantic Naming](#page-3-0)
    - [Reasons:](#page-3-1)
  - [Use named functions for callbacks, not anonymous functions, because it's more readable and may be more performant](#page-3-2)
  - [Use single quotes for variables, double quotes for strings in React props, and string templates when you need to interpolate a](#page-4-0) [variable value into the string.](#page-4-0)
  - [Use a constant if a string is being used more than once in a file](#page-4-1)
- [Functions](#page-5-0)
  - [Skip the curly braces in arrow functions if you can do so](#page-5-1)
  - [Pass one object as an argument to a function instead of multiple arguments.](#page-5-2)
    - [Reasons](#page-5-3)
  - [Write atomic functions](#page-6-0)
  - [Move unchanging constants and conditionals out of the function](#page-8-0) 
    - [Reasons](#page-8-1)
- [Imports and Exports](#page-9-0)
  - [Don't create exported namespaces which result in the required module being defined like this: Namespace.function. Just export the](#page-9-1) [function directly.](#page-9-1)
  - [Use an](#page-10-0) [index.ts file for exporting a React component or for a small group of things that are always used together](#page-10-0)
  - [Avoid using index.ts or barrel exports for constants or modules that are not closely related](#page-10-1)
    - [Reasons](#page-10-2)
  - [Keep constants in the module where they are used](#page-11-0)
    - [Reasons](#page-11-1)
- [Conditionals](#page-12-0)
  - [When using a discriminating union in TS, use a switch case to enforce type safety and exhaustiveness](#page-12-1)
    - [Reasons](#page-12-2)
  - [For large or expanding numbers of cases, use an object literal instead of a switch or if/else statements.](#page-14-0)
    - [Reasons](#page-14-1)
- [Promises](#page-15-0)
  - [When using async/await, it's recommended to use return await \\$promise rather than just returning the promise and using the](#page-15-1) [implicit Promise.resolve that async provides.](#page-15-1)
  - [When rejecting a promise, we should make sure to reject it with an instance of Error](#page-16-0)
- [React](#page-16-1)
  - [If it's a function that returns JSX, make it a functional component and use it in JSX.](#page-16-2)
  - [Keep "leaf" components general; avoid coupling parent and child components](#page-17-0)
  - [General guides for component folder structure in react projects](#page-18-0)
  - [Avoid useCallback and useMemo unless you have a good reason to use them](#page-19-0)

- [Styling](#page-20-0)
  - [Styled Components](#page-20-1)
  - [Chegg UI Theme](#page-21-0)
    - [Spacing](#page-21-1)
    - [Font](#page-21-2)
    - [Breakpoints](#page-22-0)
- [TypeScript](#page-22-1)
  - [Follow the Best Practices](#page-22-2)
  - [Always use 'unknown' not 'any'.](#page-22-3)
  - [Use types from the base type, like 'Lesson\['id'\]' rather than 'string'.](#page-23-0)
  - [Add 'Readonly' to React or other state. Enforce immutability.](#page-23-1)
  - [Use Generated Types for API Data from GraphQL](#page-24-0)
  - [Always use spread operator, `{...thing}`, and not `Object.assign\({}, foo, bar\)`. Because `Object.assign` returns an `any` type.](#page-24-1)
  - [Use React.FunctionComponent or React.FC for functional components.](#page-24-2)
- [Error Handling and Logging](#page-25-0)
  - [Do not log sensitive information](#page-25-1)
  - [Use captureError to log errors or for debug logs](#page-25-2)
  - [Call captureError in useEffect](#page-26-0)
  - [Write meaningful error messages](#page-26-1)
  - [Examples](#page-26-2)
  - [Preventing logging fatigue](#page-27-0)
  - [Tag the team that owns the code!](#page-27-1)
  - [Wrap any methods which could throw, like JSON.parse and JSON.stringify, in a try/catch](#page-27-2)
  - [Error Boundaries](#page-27-3)
- [Comments](#page-29-0)
  - [Make sure all variable & function names are descriptive and provide enough insight into what's happening.](#page-29-1)
  - [Write a comment above every function & component explaining the purpose of the function/component.](#page-29-2)
  - [Write a comment for each conditional that should explain the branching.](#page-29-3)
- [Tests:](#page-29-4)
  - [Unit Test Description](#page-29-5)
  - [One 'expect' per 'it'](#page-30-0)
  - [Use userEvent instead of fireEvent](#page-31-0)
  - [General Guidelines](#page-31-1)
  - [Every data test ID should be unique](#page-32-0)
- [Integrated Tests using TestCafe](#page-33-0)
  - [General Guidelines](#page-33-1)
    - [Example Test](#page-33-2)
- [Storybook](#page-33-3)
- [Experiments and Feature Flags](#page-34-0)
  - [Use Optimizely](#page-34-1)
  - [Clean Up Old Experiments and Feature Flags](#page-35-0)
- [Rule Template](#page-35-1)
  - [Short one sentence description using the `Heading 3` format](#page-35-2)

# General Style Guide

### **Casing**

# Use:

- PascalCase for Components, Classes, Types and Enum types
- <span id="page-1-1"></span><span id="page-1-0"></span>SCREAMING\_SNAKE\_CASE for enum keys and constant variables

- kebab-case for HTML attribute values like id's, test id's ( data-test )and layout areas ( data-area )
- camelCase for all other variable names
- Examples

![](_page_2_Picture_3.jpeg)

YES

```
1 // use PascalCase for React Components, kebab-case for test id's
2
3 const MyHeader = (props) => (
4 <h1 data-test="my-header">Hello {props.name}!</h1>
5 );
6
7 class Message extends React.Component<Props, State> {
8 render() {
9 return (
10 <div>{this.props.messageText}</div>
11 );
12 }
13 }
14
15 // use PascalCase for any other Classes
16
17 class MockMoment {
18 public format() {
19 return 'TEST_TIMESTAMP';
20 }
21 }
22
23 // use SCREAMING_SNAKE_CASE for enum keys and constants
24
25 export const IMAGE_UPLOAD_TYPES = 'image/*';
26
27 export enum AttachmentOriginType {
28 GRAPHING_TOOL = 'graphing_tool',
29 MATH_TOOL = 'mathTypeImage',
30 SCRATCH_PAD = 'scratchPadFileType',
31 TEST = 'test'
32 }
33
34 // use kebab-case for HTML attribute values
35
36 export enum MyTestIds {
37 MODULE_A = 'module-a',
38 LINK_B = 'link-b',
39 HEADING_C = 'heading-c'
40 }
41
42 export enum MyLayoutAreas {
43 AREA_A = 'area-a',
44 AREA_B = 'area-b',
45 AREA_C = 'area-c'
46 }
47
48 const MY_COMPONENT_ID = 'my-component-id'
49
50 // use camelCase for all other variable names
51
```

```
52 // camelCase for helper functions, params, and local variables
53 const determineIsLoading = (hasData) => {
54 let isLoading = false;
55
56 if (!hasData) {
57 isLoading = true;
58 }
59 }
```

### **Semantic Naming**

<span id="page-3-0"></span>We need to choose clear, accurate, semantic names for variables, attributes, classes, etc. in our code because it allows future engineers reading the code to understand it.

Avoid "generic" names, like "obj" and "arr" and "a", "b", "c".

Be intentional about pluralization - an array of ids is ids not id . An object containing props for Foo is FooProps , not FooProp .

#### **Reasons:**

Semantic names help engineers understand what the code is doing.

```
Examples
    YES
1 // Use clear variable and attribute names
2 const timerProps = {
3 startTime: currentTime,
4 endTime: currentTime + 5_SECONDS_IN_MS,
5 description: 'execution time',
6 };
    NO
1 // Antipattern - bad naming.
2 // Adding comments does not compensate for using bland names
3 const config = {
4 configA: currentTime, // start time
5 configB: currentTime + 5000, // end time
6 configC: 'execution time', // description of time tracked
7 };
```

**Use named functions for callbacks, not anonymous functions, because it's more readable and may be more performant**

```
Examples
    YES
1 // YES - use named functions for callbacks.
2 const onClick = () => {
3 alert('here');
4 }
5
```

```
6 // uses named function
7 <button onClick={onClick}/>
   NO
1 // NO - antipattern, uses inline anon function
2 <button onClick={() => alert('here')}/>
```

**Use single quotes for variables, double quotes for strings in React props, and string templates when you need to interpolate a variable value into the string.**

```
Examples
    YES
 1 // single quotes for strings in variables
 2 let myString = 'foo';
 3
 4 // string templates when you need to interpolate
 5 const myMessage = `Hello ${userName}`;
 6
 7 return (
 8 // double quotes for React prop strings
 9 <MyComponent userName="Spiderman">Hello world</MyComponent>
10 );
11
```

### **Use a constant if a string is being used more than once in a file**

If a string is used more than once in a file, we should turn it into a constant or use existing [enums](https://bitbucket.cheggnet.com/projects/TUT/repos/chegg-chat-client/browse/shared/constants/index.ts#342) that could be used for the rest of the file.

```
Examples
    YES
1 const ICON_SIZE_SMALL = "small";
2
3 const ExampleHeader: React.FC<ExampleHeaderProps> = ({...ExampleHeaderProps}) => (
4 <CloseIcon size={ICON_SIZE_SMALL} />
5 <ExpandIcon size={ICON_SIZE_SMALL} />
6 <MinimizeIcon size={ICON_SIZE_SMALL} />
7 );
    NO
1 const ExampleHeader: React.FC<ExampleHeaderProps> = ({...ExampleHeaderProps}) => (
2 <CloseIcon size="small" />
3 <ExpandIcon size="small" />
4 <MinimizeIcon size="small" />
5 );
```

# <span id="page-5-1"></span><span id="page-5-0"></span>**Skip the curly braces in arrow functions if you can do so**

If you can use the implicit return syntax, then do so because it's more concise.

```
Examples
    YES
1 const handleClick = () => callback(233); 
2 <Button onClick={handleClick} />
    NO
1 const handleClick = () => {
2 return callback(233);
3 }
4
5 <Button onClick={handleClick} />
```

**Pass one object as an argument to a function instead of multiple arguments.**

#### **Reasons**

- With more than two arguments, it's easy to mix up the order.
- When passing the config object, the name of each piece of data is labeled the same way it will be labeled inside the function, making it more readable.

```
Examples
    YES
 1 // good idea - passing one object as parameter
 2 const calculateTime = ({executionTime, delay, extraAmount}) => {
 3 const totalTime = executionTime + extraAmount - delay;
 4 return totalTime;
 5 };
 6 calculateTime({
 7 executionTime, 
 8 delay: FIVE_SECONDS, 
 9 extraAmount: timeLeft,
10 });
    NO
1 // antipattern; passing multiple arguments
2 const calculateTime = (executionTime, delay, extraAmount) => {
3 const totalTime = executionTime + extraAmount - delay;
4 return totalTime;
5 };
6 // Easy to mix up the order of arguments!
7 calculateTime(executionTime, FIVE_SECONDS, timeLeft);
```

## <span id="page-6-0"></span>**Write atomic functions**

Functions should be atomic and have one clear purpose. Use sub-functions to encapsulate complex logic, hooks, and conditionals branches.

#### Examples

![](_page_6_Picture_3.jpeg)

YES

```
1 case BookCardType.TBS: {
2 const cheggStudyExpiration = getCheggStudyExpirationDate(subscriptions);
3
4 return {
5 variant: BookCardType.TBS,
6 props: {
7 solutionsExpDate: cheggStudyExpiration,
8 isbn: book.isbn,
9 },
10 };
11 }
```

# NO

```
1 case BookCardType.TBS: {
2 const cheggStudySubscriptions = subscriptions?.filter((sub) =>
3 sub?.netsuiteAttributes?.offerIds?.some(
4 (offerId) =>
5 offerId === BookSubscriptionType.CHEGG_STUDY ||
6 offerId === BookSubscriptionType.CHEGG_STUDY_V2 ||
7 offerId === BookSubscriptionType.CHEGG_STUDY_PACK
8 )
9 );
10
11 const cheggStudyExpiration = cheggStudySubscriptions?.[0]
12 ?.netsuiteAttributes?.accessExpirationDate
13 ? new Date(
14 cheggStudySubscriptions[0].netsuiteAttributes.accessExpirationDate
15 )
16 : undefined;
17
18 return {
19 variant: BookCardType.TBS,
20 props: {
21 solutionsExpDate: cheggStudyExpiration,
22 isbn: book.isbn,
23 },
24 };
25 }
```

# YES

```
1 const useCurrentCourseFromURL = (slug: CourseSlug): UseCurrentCourseFromURLResult => {
2 const { query } = useRouter();
3 const result = useQuery<CurrentCourseCourses>(CURRENT_COURSE_COURSES_QUERY);
4
5 const course: CurrentCourse | undefined = useMemo(
```

```
6 () => getCurrentCourse(result, :),
7 [result, :]
8 );
9
10 const error: CurrentCourseError = useMemo(
11 () => getCurrentCourseError({ result, course }),
12 [result, course]
13 );
14
15 useHandleCurrentCourseErrors({ error, apolloError: result.error });
16
17 return { course, error, loading: result.loading };
18 };
```

# NO

```
1 const useCurrentCourseFromURL = (slug?: CourseSlug): UseCurrentCourseFromURLResult => {
2 const { query, replace } = useRouter();
3 const result = useQuery<CurrentCourseCourses>(CURRENT_COURSE_COURSES_QUERY);
4
5 const course: CurrentCourse | undefined = useMemo(() => {
6 if (slug?.type === CourseSlugType.COURSE) {
7 return result.data?.myCourses.find((c) => c.id === slug?.id);
8 }
9 }, [result.data, parsedSlug]);
10
11 const error: CurrentCourseError = useMemo(() => {
12 if (!slug) {
13 return { type: CurrentCourseErrorType.INVALID_SLUG, slug };
14 }
15
16 if (slug.type !== CourseSlugType.COURSE) {
17 return {
18 type: CurrentCourseErrorType.COURSE_TYPE_NOT_SUPPORTED,
19 courseType: slug.type,
20 };
21 }
22
23 if (result.error) {
24 return {
25 type: CurrentCourseErrorType.FETCH_ERROR,
26 error: result.error.message,
27 };
28 }
29
30 if (!result.loading && !course) {
31 return {
32 type: CurrentCourseErrorType.COURSE_NOT_FOUND,
33 slugId: slug.id,
34 slugType: slug.type,
35 };
36 }
37 }, [result, course, slug]);
38
39 useEffect(() => {
40 if (error) {
41 captureError(new Error(CURRENT_COURSE_ERROR_LABEL), error);
42 }
```

```
43
44 if (error && REDIRECT_ERRORS.includes(error.type)) {
45 replace("/");
46 }
47 }, [replace, error]);
48
49 useEffect(() => {
50 if (result.error) captureError(result.error);
51 }, [result.error, error]);
52
53 return { course, error, loading: result.loading };
54 };
```

### **Move unchanging constants and conditionals out of the function**

#### **Reasons**

The conditional will be evaluated every time even though the result won't change

```
The const will be evaluated even though the values don't change
it makes the function longer for with no benefit, especially if there are comments.
examples
    YES
  1 // Yes - move constants and conditionals outside the function
  2
  3 // We set this constant during page load and using polling
  4 const IS_OFFLINE = ENV.is_offline === 'true';
  5
  6 const TestConfig = {
  7 TEST_ID_OFFLINE: 'WOOT',
  8 TEST_ID_ONLINE: 'FOOBAR',
  9 }
 10
 11 const getTestConfig = () => (
 12 // We use different configs when offline
 13 IS_OFFLINE ? TestConfig.TEST_ID_OFFLINE : TestConfig.TEST_ID_ONLINE;
 14 );
    NO
  1 // Antipattern - 
  2
  3 const TestConfig = {
  4 TEST_ID_OFFLINE: 'WOOT',
  5 TEST_ID_ONLINE: 'FOOBAR',
  6 }
  7
  8 const getTestConfig = () => (
  9 // We use different configs when offline
 10 // We set this constant during page load and using polling
 11 ENV.is_offline === 'true' ? 
 12 TestConfig.TEST_ID_OFFLINE : TestConfig.TEST_ID_ONLINE;
 13 );
```

# <span id="page-9-1"></span><span id="page-9-0"></span>Imports and Exports

**Don't create exported namespaces which result in the required module being defined like this: Namespace.function. Just export the function directly.**

```
Examples
    YES
 1 // in styled.tsx
 2 export const NormalButton = styled(button)`
 3 {
 4 font-size: 12px;
 5 background-color: white;
 6 }
 7 `;
 8
 9 export const FancyButton = styled(button)`
10 {
11 font-size: 18px;
12 background-color: #BADA55;
13 }
14 `;
15
16 // in consumer
17 require {NormalButton, FancyButton} from './styled';
18
19 ...
20 <NormalButton />
21 <FancyButton />
```

NO

```
1 // in styled.tsx
2 const normalButton = styled(button)`
3 {
4 font-size: 12px;
5 background-color: white;
6 }
7 `;
8
9 const fancyButton = styled(button)`
10 {
11 font-size: 18px;
12 background-color: #BADA55;
13 }
14 `;
15
16 export default { normalButton, fancyButton };
17
18 // in consumer
19 require Buttons from './styled';
20
21 ...
22 <Buttons.normalButton />
23 <Buttons.fancyButton />
24
```

# <span id="page-10-0"></span>**Use an** index.ts **file for exporting a React component or for a small group of things that are always used together**

When creating a JS module, we sometimes create an index.ts inside the component folder to control the public API of the module. An index.ts file can export the <ComponentA> (a component) and ComponentAProps (props for that component) and formatComponentAProps (a utility related to that component) from the same index.ts file because they would usually be used

together.

IMPORTANT - don't group large numbers of things together and export them using one index.ts , because this bloats the bundle. For example - putting all the test IDs for all components into one file, and exporting those all using an index.ts as one module, will result in all those test IDs being loaded into the bundle when only one is used.

![](_page_10_Figure_6.jpeg)

## **Avoid using** index.ts **or barrel [exports](https://basarat.gitbook.io/typescript/main-1/barrel) for constants or modules that are not closely related**

Avoiding the use of barrel (index) files which simply re-export code from multiple sub-modules. This rule applies to JS modules that are not related to each other, for example, a utility function exported from a shared folder is not related to the other utils exported from the same folder.

# **Reasons**

<span id="page-10-1"></span>Click here to expand... Let's say we have a module, barbazfoo , which exports three functions; foo , bar , baz . *barbazfoo/index.js barbazfoo/bar.js barbazfoo/baz.js* 1 export { bar } from "./bar"; 2 export { baz } from "./baz"; 3 export { foo } from "./foo"; 1 export const bar = () => "bar";

## *barbazfoo/foo.js*

<span id="page-10-2"></span>1 export const baz = () => "baz";

```
1 export const foo = () => "foo";
```

Our app has three pages, each importing a single function from our module.

```
Page1 imports foo from barbazfoo .
```

Page2 imports bar from barbazfoo .

Page3 imports foo from barbazfoo/foo . **!!**

baz is not used in our app.

With a standard configuration Webpack will bundle our app, pages, and module into a single bundle.

```
1 dist/
2 └── [153K] main.bundle.js
```

Tree shaking will do the right thing and drop baz from barbazfoo as it is not used anywhere in the app.

**However**, if we use code-splitting with dynamic imports:

```
1 import loadable from '@loadable/component';
2
3 const Page1 = loadable(() => import('./page1'));
4 const Page2 = loadable(() => import('./page2'));
5 const Page3 = loadable(() => import('./page3'));
6
7 ...
8
9 export default App;
```

Now webpack will split our app bundle into four bundles..

```
1 dist/
2 ├── [161K] main.bundle.js
3 ├── [ 441] pages-page1.bundle.js
4 ├── [ 441] pages-page2.bundle.js
5 └── [ 304] pages-page3.bundle.js
```

Tree shaking will still do the right thing and drop baz from barbazfoo , but there's a catch..

**The bundles for** page1 and page2 imported from the barbazfoo index file will include both the foo and bar functions, even though they only use one or the other.

However, the bundle for page3 which is imported from barbazfoo/foo directly will only include the foo function.

# **Keep constants in the module where they are used**

The anti-pattern we are avoiding is putting all the values for a certain type of const in one ever-growing file used by multiple modules.

#### **Reasons**

- When we put N constants in a file, and one of them is used, then the bundle will contain all N 1 which are not used.
- Over time, if we keep adding more and more constants in the same file, that file becomes large and hard to understand/navigate.

```
Click here to expand...
```

![](_page_11_Figure_20.jpeg)

```
1 // inside components/ToolTip/index.ts
2 import ToolTip, {
3 ToolTipTestId,
4 } from './ToolTip';
```

```
5
6 export { ToolTipTestId };
7
8 export default ToolTip
9
10 // inside components/MyCoursesSection/index.ts
11 import MyCoursesSection, {
12 MyCoursesErrorSection,
13 myCoursesSectionCopyConfig,
14 MyCoursesSectionTestId
15 } from './MyCoursesSection';
16
17 export { MyCoursesErrorSection, myCoursesSectionCopyConfig, MyCoursesSectionTestId };
18
19 export default MyCoursesSection;
   NO
1 // inside constants/testIds/index.ts
2
3 export const ToolTipTestId = 'tooltip';
4
5 export const MyCoursesSectionTestId = 'my-courses';
6
7 // ... every other test ID listed in this one file
```

# Conditionals

**When using a discriminating union in TS, use a switch case to enforce type safety and exhaustiveness**

### **Reasons**

- When using a [discriminating](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) union in TypeScript, using a switch statement gives TypeScript the ability to:
  - Understand and enforce the correct type
  - Detect when a possible case is not handled
- Using an object literal will not work in this case.

```
Examples
    YES
 1 interface GoogleDriveExport {
 2 type: ExportType.googleDrive,
 3 citations: Citation[]
 4 }
 5
 6 interface MoveExport {
 7 type: ExportType.move,
 8 citations: Citation[],
 9 targetProject: Project
10 }
11 // discriminating union
12 type CitationsExport = GoogleDriveExport | MoveExport
13
```

```
14 function getExportMessageSwitch(result: CitationsExport): string {
15 switch(result.type) {
16 case ExportType.move:
17 // TypeScript knows that `targetProject` exists
18 return `Moving ${result.citations.length} citation(s) to ${result.targetProject}`
19 case ExportType.googleDrive:
20 return `Exporting ${result.citations.length} citation(s) to drive`
21 }
22 }
```

# NO

```
1 interface GoogleDriveExport {
2 type: ExportType.googleDrive,
3 citations: Citation[]
4 }
5
6 interface MoveExport {
7 type: ExportType.move,
8 citations: Citation[],
9 targetProject: Project
10 }
11 // discriminating union
12 type CitationsExport = GoogleDriveExport | MoveExport
13 // Antipattern: below code does not work!
14 function getExportMessageObj(result: CitationsExport): string {
15 return ({
16 [ExportType.googleDrive]: `Exporting ${result.citations.length} citation(s) to drive`,
17 // Can't access targetProjectHere
18 [ExportType.move]: `Moving ${result.citations.length} citation(s) to ${result.targetProject}`
19 })[result.type]
20 }
```

# NO

```
1 interface GoogleDriveExport {
2 type: ExportType.googleDrive,
3 citations: Citation[]
4 }
5
6 interface MoveExport {
7 type: ExportType.move,
8 citations: Citation[],
9 targetProject: Project
10 }
11 // discriminating union
12 type CitationsExport = GoogleDriveExport | MoveExport
13 // Does not always recognize exhaustiveness
14 // TS will not warn you if you have an unhandled case.
15 function getExportMessageCond(result: CitationsExport): string {
16 if (result.type === ExportType.move) {
17 return `Moving ${result.citations.length} citation(s) to ${result.targetProject}`
18 }
19
20 // TS recognizes that result is GoogleDriveExport,
21 // but if we include if (result.type === ExportType.googleDrive), it does not recognize exhaustiveness
22 return `Exporting ${result.citations.length} citation(s) to drive`
```

# <span id="page-14-0"></span>**For large or expanding numbers of cases, use an object literal instead of a switch or if/else statements.**

### <span id="page-14-1"></span>**Reasons**

- As the number of "cases" increases, the performance of the object (hash table) gets better than the average cost of the switch, which is O(n) where n is the number of cases. The object approach is a hash table lookup, and the switch has to evaluate each case until it hits a match and a break.
- With large or expanding numbers of cases, this is one way to reduce boilerplate. Other techniques include moving duplicated code into reusable helper (DRY) and breaking code into modules so it's not one giant function. The Redux [documentation](https://redux.js.org/recipes/structuring-reducers/refactoring-reducer-example) about refactorin[g](https://redux.js.org/recipes/structuring-reducers/refactoring-reducer-example) [reducers](https://redux.js.org/recipes/structuring-reducers/refactoring-reducer-example) walks through a real example.

Examples

![](_page_14_Figure_7.jpeg)

```
1 type CustomTypeActionMap = {[key in CUSTOM_MESSAGE_TYPE]: (ActionMapParams) => void};
2
3 // We expect there will be more items added over time!
4 // A map containing the key as a message customType and an associated function
5 // as an execution step for that key
6 const CUSTOM_TYPE_ACTION_MAP:CustomTypeActionMap = {
7 [CUSTOM_MESSAGE_TYPE.CLIENT_CONNECTED_MSG]: handleDispatchClientConnected,
8 [CUSTOM_MESSAGE_TYPE.EDITOR_FILE_UPDATE]: handleUpdateEditorFile,
9 [CUSTOM_MESSAGE_TYPE.EDITOR_UPDATE_STATE]: handleUpdateEditorState,
10 [CUSTOM_MESSAGE_TYPE.EDITOR_GET_LATEST_STATE]: handleUpdateOtherEditorClient,
11 [CUSTOM_MESSAGE_TYPE.TIMER_MESSAGE]: handleDispatchAddMessage,
12 [CUSTOM_MESSAGE_TYPE.UNDEFINED]: handleDispatchAddMessage
13 };
14
15 const initChannelHandlers = () => {
16 ChannelHandler.onMessageReceived = (
17 channel: SendBird.BaseChannel,
18 message: SendBirdMessage
19 ) => {
20 if (message) {
21 // if a message is defined, extract all the necessary data to execute
22 // an action associated with the customType of a message
23 const { customType, data } = message;
24 CUSTOM_TYPE_ACTION_MAP[customType || CUSTOM_MESSAGE_TYPE.UNDEFINED]({
25 channel,
26 message,
27 data
28 });
29 }
30 };
31 }
```

```
NO
```

```
1 const initChannelHandlers = () => {
2 ChannelHandler.onMessageReceived = (
3 channel: SendBird.BaseChannel,
4 message: SendBirdMessage
5 ) => {
```

```
6 if (message) {
7 // if a message is defined, extract all the necessary data to execute
8 // an action associated with the customType of a message
9 const { customType, data } = message;
10 // Antipattern; We expect there will be more items added over time!
11 // This switch will likely grow too large.
12 switch (customType) {
13 case CUSTOM_MESSAGE_TYPE.CLIENT_CONNECTED_MSG: {
14 handleDispatchClientConnected({channel, message, data});
15 }
16 case CUSTOM_MESSAGE_TYPE.EDITOR_FILE_UPDATE: {
17 handleUpdateEditorFile({channel, message, data});
18 }
19 case CUSTOM_MESSAGE_TYPE.EDITOR_UPDATE_STATE: {
20 handleUpdateEditorState({channel, message, data});
21 }
22 case CUSTOM_MESSAGE_TYPE.EDITOR_GET_LATEST_STATE: {
23 handleUpdateOtherEditorClient({channel, message, data});
24 }
25 case CUSTOM_MESSAGE_TYPE.TIMER_MESSAGE: {
26 handleDispatchAddMessage({channel, message, data});
27 }
28 default:
29 handleDispatchAddMessage({channel, message, data});
30 }
31
```

# Promises

**When using async/await, it's recommended to use return await \$promise rather than just returning the promise and using the implicit Promise.resolve that async provides.**

- Always using return inside of async will wait for the promise/reject resolve so that any try/catch block will be reached. Just using return in this scenario with a rejected promise will raise a uncaught promise exception if handled by the caller
- async function [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#Rewriting_a_promise_chain_with_an_async_function) | MDN
- Example [promise\\_rejection\\_example](https://codesandbox.io/s/promise-rejection-example-qzno18?file=/src/index.js) CodeSandbox

<span id="page-15-1"></span><span id="page-15-0"></span>Examples

![](_page_16_Figure_0.jpeg)

## **When rejecting a promise, we should make sure to reject it with an instance of Error**

From Mozilla: The static [Promise.reject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) function returns a Promise that is rejected. For debugging purposes and selective error catching, it i[s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) useful to make reason an [instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) Error.

# React

### **If it's a function that returns JSX, make it a functional component and use it in JSX.**

```
Examples
    YES
1 // Let's do this:
2 const Foo: React.FunctionComponent<FooProps> = ({bar, baz}) => (
3 <div className={baz}>{bar}</div>
4 );
5
6 // ... inside some other component
7 <div>
8 <Foo bar="Hello" baz="myClassname" />
9 </div>
```

```
NO
```

```
1 // Antipattern - let's not do this
2 function foo(bar, baz) {
3 return (
4 <div className={baz}>{bar}</div>
5 );
6 }
7
8 // ... inside some other component
9 <div>
10 {foo('Hello', 'myClassname')}
11 </div>
```

### **Keep "leaf" components general; avoid coupling parent and child components**

The more general a component is, the easier it is to reuse and to change in the future.

<span id="page-17-0"></span>Examples

Let's say we're passing a callback from one component into another component.

# YES

```
1 // In AppHeader
2
3 const AppHeader = ({lessonId, endLesson}) => {
4 const endThisLesson = () => endLesson(lessonId);
5 return (
6 <Header> 
7 // ...
8 <FancyButton onClick={endThisLesson}>End Lesson</FancyButton>
9 </Header>
10 );
11 }
12
13 // In FancyButton
14
15 const FancyButton = ({children, onClick}) => {
16 return (
17 <StyledButton onClick={onClick}>{children}</StyledButton>
18 );
19 };
```

Notice how the FancyButton is very general? We could easily reuse it somewhere else.

Now here is the anti-pattern:

# NO

```
1 // In AppHeader
2
3 const AppHeader = ({lessonId, endLesson}) => {
4 return (
5 <Header> 
6 // ...
7 <FancyEndLessonButton onClick={endLesson} lessonId={lessonId}>End Lesson</FancyEndLessonButton>
```

```
8 </Header>
9 );
10 }
11
12 // In FancyEndLessonButton
13 // We could only use FancyButton in that one place
14 const FancyEndLessonButton = ({children, onClick, lessonId}) => {
15 const handleClick = () => onClick(lessonId);
16 return (
17 <StyledButton onClick={handleClick}>{children}</StyledButton>
18 );
19 };
```

Don't pass both the argument and the callback into the child component, because this creates unneeded tight coupling between the child and parent components.

The child doesn't need to know the details about that callback. It makes FancyButton less flexible.

### **General guides for component folder structure in react projects**

Aim to organize smaller "sub-components" within components/[component-name] directory into a folder called internals . The "internals" might have their own styled.ts for keeping styled-components. The goal is to have a visual understanding of what are the internals of a component that is built with sub-components that aren't going to be reused in other places. However, if there are plans on reusing them in other components, then probably you should think of housing them in libs/common/components directory.

# <span id="page-18-0"></span>**Do not import components from the** internals **of another component.**

Example of a component file structure where "internals" folder contains smaller components that have a scope to be used only in the parent NavController component:

![](_page_18_Figure_7.jpeg)

```
1 .........
2 ├── components
3 │ ├── home
4 │ │ ├── NavController
5 │ │ │ ├── __tests__
6 │ │ │ │ ├── NavController.test.tsx
7 │ │ │ ├── internals
8 │ │ │ │ ├── NavItem.tsx
9 │ │ │ │ ├── NavList.tsx
10 │ │ │ │ ├── styled.tsx
11 │ │ │ ├── NavController.tsx
12 │ │ │ ├── index.stories.tsx
13 │ │ │ └── index.tsx
14 │ │ │ └── styled.tsx
15 │ ├── common
16 .........
```

Notice how the NavController has internals ? If there are no plans for reusing the NavItem and NavList in other external components then house these smaller sub-components into a folder called internals in the component directory.

Now here is the anti-pattern of components file structure where it's hard to say what component is the main one and what components are "sub-components":

![](_page_18_Picture_11.jpeg)

```
1 .........
2 ├── components
3 │ ├── home
4 │ │ ├── NavController
5 │ │ │ ├── __tests__
6 │ │ │ │ ├── NavController.test.tsx
7 │ │ │ ├── NavItem.tsx
8 │ │ │ ├── NavList.tsx
9 │ │ │ ├── NavController.tsx
10 │ │ │ ├── index.stories.tsx
11 │ │ │ └── index.tsx
12 │ │ │ └── styled.tsx
13 │ ├── common
14 .........
```

### **Avoid** useCallback **and** useMemo **unless you have a good reason to use them**

- Adding useCallback or useMemo adds work for the browser to do, and does not automatically improve performance.
- See When to useMemo and [useCallback](https://kentcdodds.com/blog/usememo-and-usecallback) for more in depth explanation on why useCallback and useMemo don't usually improve performance, and could even hurt performance.
- <span id="page-19-0"></span>See Avoid Un-necessary `useCallback` and [`useMemo`calls](https://chegg.atlassian.net/wiki/spaces/BE/pages/2650243195/Avoid+Un-necessary+useCallback+and+useMemo+calls) for benchmarks verifying useCallback doesn't improve performance in a typical use case.
- When *should* you useCallback or useMemo ?
  - useCallback and useMemo , along with React.memo , are tools we can use to eliminate extra rendering cycles for components which are slow to render.
  - See a real example When to [useCallback?](https://codepen.io/paradasia/pen/qBpOxBR?editors=0011)
- Examples

If we're rendering a normal React component with a callback prop, don't both with useCallback or useMemo .

YES

```
1 function CandyDispenser() {
2 const initialCandies = ['snickers', 'skittles', 'twix', 'milky way']
3 const [candies, setCandies] = React.useState(initialCandies)
4 const dispense = candy => {
5 setCandies(allCandies => allCandies.filter(c => c !== candy))
6 }
7 return (
8 <div>
9 // ...
10 <ul>
11 {candies.map(candy => (
12 <li key={candy}>
13 <button onClick={() => dispense(candy)}>grab</button> {candy}
14 </li>
15 ))}
16 </ul>
17 )}
18 // ...
19 </div>
20 )
21 }
```

Now here is the anti-pattern:

```
NO
```

```
1 function CandyDispenser() {
2 const initialCandies = ['snickers', 'skittles', 'twix', 'milky way']
3 const [candies, setCandies] = React.useState(initialCandies)
4 // Adding React.useCallback does not help! Don't bother!
5 const dispense = React.useCallback(candy => {
6 setCandies(allCandies => allCandies.filter(c => c !== candy))
7 }, [])
8 return (
9 <div>
10 // ...
11 <ul>
12 {candies.map(candy => (
13 <li key={candy}>
14 <button onClick={() => dispense(candy)}>grab</button> {candy}
15 </li>
16 ))}
17 </ul>
18 )}
19 // ...
20 </div>
21 )
22 }
```

We only need useCallback if we're trying to eliminate extra rendering for a slow component, like in the below example:

```
YES
```

```
1 const SlowComponent = React.memo(() => {
2 // ... slow work happening here
3 });
4
5 const ExampleWithUseCallback = () => {
6 const [count, setCount] = React.useState(0);
7 const onClick = React.useCallback(() => console.log('Hello!'), []);
8 return (
9 <>
10 <h1>Example with useCallback</h1>
11 <p>Current count: {count}</p>
12 <p><button onClick={() => setCount(count + 1)}>Increase count</button></p>
13 <p>Clicking to Increase Count should not trigger the Slow Component to re-render.</p>
14 <SlowComponent onClick={onClick} />
15 </>
16 );
17 }
```

# Styling

# **Styled Components**

<span id="page-20-1"></span><span id="page-20-0"></span>Besides the normal benefits of [styled-components,](https://www.styled-components.com/docs/basics) we recommend using them whenever you find yourself needing to add styles to a component for consistency and readability.

### <span id="page-21-0"></span>**Chegg UI Theme**

[@chegg-ui/theme](https://storybook.cheggnet.com/storybook/chegg-ui-theme/) exposes constants for spacing, fonts and breakpoints. Using these constants instead of hard-coding our own values makes our styling more consistent, accessible and maintainable. Both design specs and the Chegg UI libraries should conform to the current design system, so we should be able to use the Horizon Chegg UI theme constants for nearly all styling requirements.

#### <span id="page-21-1"></span>**Spacing**

Only use spacing property values exposed from @chegg-ui/theme . Note that the spacing sizes sm , md , lg , etc have been deprecated in favor of px16 , px12 , px24 . When absolutely necessary, use calc to adjust.

![](_page_21_Figure_4.jpeg)

### **Font**

Only use font property values exposed from the Horizon Chegg UI theme.

```
Examples
    YES
1 const Thing = styled.div`
2 font-size: ${({ theme }) => theme.cuiTheme.font.size.xs};
3 color: ${({ theme }) => theme.cuiTheme.colors.border.dark900}; 
4
5 `;
    NO
1 export const Thing = styled.div`
2 font-size: 16px;
```

```
3 color: black;
4 `
```

## <span id="page-22-0"></span>**Breakpoints**

Only use breakpoint values exposed from the Chegg UI Horizon theme. Do not use hard-coded or irregular breakpoints.

```
Examples
    YES
1 const Thing = styled.div`
2 @media only screen and (min-width: ${({ theme }) =>
3 theme.cuiTheme.breakpoints.sm.min}) {
4 ) and (max-width: ${({ theme }) =>
5 theme.cuiTheme.breakpoints.sm.max}) {
6 margin: 0;
7 }
8 `;
    NO
1 const Thing = styled.div`
2 @media only screen and (min-width: 0px}) and (max-width: 599px) {
3 margin: 0;
4 }
5 `;
    NO
1 const Thing = styled.div`
2 @media only screen and (max-width: 750px) {
3 margin: 0;
4 }
5 `;
```

# TypeScript

# **Follow the Best Practices**

Read and follow the Best Practices from the [TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) docs.

In addition, we maintain our own "Best Practices", **so anything below will override what is in the docs.**

#### **Always use 'unknown' not 'any'.**

- Because unknown still does a check for type safety when the value is used, vs. any turns off all type safety checks.
- Except in tests. Do what you need in tests...no judgement.

```
Examples
    YES
1 // Using 'unknown' is better than 'any'
```

```
2 export interface ErrorBoxProps {
3 onClose: (x: unknown) => void;
4 }
   NO
1 // Using 'any' is forbidden. 
2 export interface ErrorBoxProps {
3 onClose: (x: any) => void;
4 }
```

**Use types from the base type, like 'Lesson['id']' rather than 'string'.**

```
Examples
    YES
1 interface FeedbackActionPayload {
2 id?: Lesson['id'];
3 lessonId?: Lesson['id'];
4 }
    NO
1 interface FeedbackActionPayload {
2 id?: string;
3 lessonId?: string;
4 }
```

# **Add 'Readonly' to React or other state. Enforce immutability.**

For reasons we prefer immutable state - React.js Conf 2015 - [Immutable](https://www.youtube.com/watch?v=I7IdS-PbEgI) Data and React

Note that **we should avoid using Immutable.js**, and use the readonly attribute of TypeScript instead, but the benefits are similar.

```
examples
    YES
 1 export interface Message {
 2 readonly messageId: number;
 3 readonly message: string;
 4 readonly createdAt: number;
 5 readonly channelUrl: string;
 6 readonly sender: LessonUser;
 7 readonly fileName?: string;
 8 readonly fileUrl?: string;
 9 readonly fileType?: string;
10 readonly messageType?: MESSAGE_TYPE;
11 }
    NO
 1 export interface Message {
 2 messageId: number;
```

```
3 message: string;
4 createdAt: number;
5 channelUrl: string;
6 sender: LessonUser;
7 fileName?: string;
8 fileUrl?: string;
9 fileType?: string;
10 messageType?: MESSAGE_TYPE;
11 }
```

# **Use Generated Types for API Data from GraphQL**

<span id="page-24-0"></span>We use [GraphQL](https://chegg.atlassian.net/wiki/spaces/BE/pages/958760299) Codegen to generate accurate TypeScript types for all of our GraphQL queries and mutations.

Check out this [tutorial](https://gitlab.com/chegginc/learning-services/web/chegg-web/-/blob/main/chegg-web-app/docs/tutorials/add-gql-query.md) to learn how.

**Always use spread operator, `{...thing}`, and not `Object.assign({}, foo, bar)`. Because `Object.assign` returns an `any` type.**

See Object.assign({}) seems to always return a type any · Issue #29348 · [microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/29348)

```
Examples
    YES
1 const lessonsList = { ...state.lessonsList };
    NO
1 const lessonsList = Object.assign({}, state.lessonsList);
```

#### **Use React.FunctionComponent or React.FC for functional components.**

Reasons:

Because the React.FC type gives TypeScript more information about the component automatically.

```
Examples
    YES
 1 /**
 2 * InfoBox - displays status of a uploaded file.
 3 */
 4 const InfoBox: React.FunctionComponent<InfoBoxProps> = ({ text }) => {
 5 return (
 6 <Layout>
 7 <Icon />
 8 <Text>{text}</Text>
 9 </Layout>
10 );
11 };
12
13 // or React.FC for short
14 // They are the same.
15
16 /**
```

```
17 * InfoBox - displays status of a uploaded file.
18 */
19 const InfoBox: React.FC<InfoBoxProps> = ({ text }) => {
20 return (
21 <Layout>
22 <Icon />
23 <Text>{text}</Text>
24 </Layout>
25 );
26 };
```

NO

```
1 /**
2 * InfoBox - displays status of a uploaded file.
3 */
4 // Skipping the type for InfoBox means TypeScript has less info
5 const InfoBox = ({ text }: InfoBoxProps) => {
6 return (
7 <Layout>
8 <Icon />
9 <Text>{text}</Text>
10 </Layout>
11 );
12 };
13
14 // Avoid React.SFC and React.StatelessFunctionalComponent
15 // This term is deprecated 
16
17 /**
18 * InfoBox - displays status of a uploaded file.
19 */
20 const InfoBox: React.SFC<InfoBoxProps> = ({ text }) => {
21 return (
22 <Layout>
23 <Icon />
24 <Text>{text}</Text>
25 </Layout>
26 );
27 };
```

# Error Handling and Logging

# **Do not log sensitive information**

For more information, visit the security team's guideline: Logging best [practices](https://chegg.atlassian.net/wiki/spaces/SEC/pages/239733361)

# **Use captureError to log errors or for debug logs**

<span id="page-25-2"></span><span id="page-25-1"></span><span id="page-25-0"></span>We can use the captureError() function. SAML single [sign-on](https://gitlab.com/chegginc/learning-services/web/chegg-web/-/blob/main/chegg-web-app/libs/common/utils/newRelicHelpers.ts#L28) for Chegg · GitLab Underneath, this uses New Relic''s [noticeError](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/noticeerror-browser-agent-api/) API. accepts errorMessage: ErrorAttributes and customAttribute?: {attr1: string, attr2: string} (optional) as arguments. An example can be seen below on **'Write meaningful error messages'**. These errors will be logged on the [JSErrors](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/javascript-errors-page-detect-analyze-errors/) tab of New Relic's browser dashboard.

## <span id="page-26-0"></span>**Call captureError in useEffect**

Make sure to call captureError() within a useEffect so if/when a component is re-rendered, captureError() is not called with the same error.

#### <span id="page-26-1"></span>**Write meaningful error messages**

# **Examples**

<span id="page-26-2"></span>![](_page_26_Figure_4.jpeg)

We want to be able to know right away what the error is about instead of having to decrypt the log.

Error messages should include {error: Error, location: string, severity: string }, {teamName: string}

#### **First param**

| property   |                                                                        |
|------------|------------------------------------------------------------------------|
| error      | could be a custom<br>string or the actual error from<br>a try/catch    |
| location   | where captureError is called                                           |
| severity   | could be CRITICAL, ERROR, WARNING, INFO, DEBUG please use<br>this enum |
| statusCode | is only used by apolloErrorLink                                        |

### **Second param**

| property |                                                                                                                                    |
|----------|------------------------------------------------------------------------------------------------------------------------------------|
| teamName | Please use this enum.<br>If your team<br>name isn't there feel free to add it.<br>You can add any key here for filtering purposes. |

## <span id="page-27-0"></span>**Preventing logging fatigue**

Investigate whether log is useful or not, after determining that it isn't then we can remove this log to avoid build-up.

## <span id="page-27-1"></span>**Tag the team that owns the code!**

### <span id="page-27-2"></span>**Wrap any methods which could throw, like** JSON.parse **and** JSON.stringify **, in a** try/catch

Any function which could throw an error can be wrapped in a try/catch , unless it is a special case where the application can't continue to function after the function fails.

JSON.parse and JSON.stringify are good examples.

JSON.parse is fragile - it will throw if it receives any argument that is not a perfectly formatted JSON string. If you're reading a stringified version of state from localstorage or an API and it ended up being undefined somehow, then the resulting error can crash the app. Similarly, JSON.stringify will throw in some cases, such as when the argument contains a circular reference.

Only wrap the JSON.parse/stringify call; do not wrap the surrounding code in the try/catch .

```
examples
    YES
 1 let appState = '{}';
 2 try {
 3 appStateAsString = JSON.stringify(appState);
 4 } catch (e) {
 5 captureError(e);
 6 }
 7 window.localstorage.setItem(LOCALSTORAGE_KEY, appStateAsString);
 8 // ... later in the code
 9
10 let hydratedState = {};
11 const cachedState = window.localstorage.getItem(LOCALSTORAGE_KEY);
12 try {
13 hydratedState = JSON.parse(cachedState);
14 } catch (e) {
15 captureError(e);
16 }
    NO
1 // This could throw!
2 const appState = JSON.stringify(appState);
3 window.localstorage.setItem(LOCALSTORAGE_KEY, appStateAsString);
4
5 // ... later in the code
6
7 // This could throw!
8 const cachedState = window.localstorage.getItem(LOCALSTORAGE_KEY);
9 let hydratedState = JSON.parse(cachedState);
```

### **Error Boundaries**

<span id="page-27-3"></span>In general, we want to wrap UI that fetches data from GraphQL in an Error Boundary. However, we do not want to be too granular and do this for every component. So wrap each section of the page.

![](_page_28_Figure_0.jpeg)

![](_page_28_Figure_1.jpeg)

# <span id="page-29-0"></span>Comments

<span id="page-29-1"></span>**Make sure all variable & function names are descriptive and provide enough insight into what's happening.**

<span id="page-29-2"></span>**Write a comment above every function & component explaining the purpose of the function/component.**

**Write a comment for each conditional that should explain the branching.**

Explain "WHY" we are doing this check in the comments for conditionals

```
Examples
    YES
1 if (account.active) {
2 // Teams can only execute payments on active accounts.
3 // Inactive accounts must go through billing as outlined;
4 // http://hr/docs/?id=foobarbaz
5 executePayment(account, team);
6 }
    NO
1 if (account.active) {
2 // We only want to do this if the account is active.
3 executePayment(account, team);
4 }
```

# Tests:

#### **Unit Test Description**

'describe' and 'it' descriptions should match what the test is actually doing.

```
Examples
    YES
 1 describe('endLesson', () => {
 2 it("should dispatch showModal action", done => {
 3 mockStore.dispatch(endLesson(endLessonPayload));
 4 mockStore.whenComplete(() => {
 5 // ONLY looks for the showModal action
 6 const TestActions = mockStore.actions.find(e => e.type === showModal.type);
 7 expect(TestActions).toBedefined();
 8 done();
 9 });
10 });});
    NO
 1 describe('endLesson', () => {
```

```
2 it('should dispatch showModal action', done => {
3 mockStore.dispatch(endLesson(endLessonPayload));
4 mockStore.whenComplete(() => {
5 // Testing more things than just the showModal action
6 expect(mockStore.actions).toMatchSnapshot();
7 done();
8 });
9 });
10 });
```

### **One 'expect' per 'it'**

<span id="page-30-0"></span>We use one 'expect' per 'it' statement because this makes it easier to see what caused an individual test to fail. If there are multiple 'expect' statements in the same 'it' block, and the test fails, then you'd have to read the unit test to see which 'expect' failed.

Examples YES 1 describe('Card Section', () => { 2 it("Shows the right number of cards when minimizing", () => { 3 render(<CardSection {...props} expanded={true} />); 4 fireEvent.click(screen.getByTestId(TestIds.SHOW\_MORE\_OR\_LESS\_BUTTON)); 5 const cardsParent = screen.getByTestId(TestIds.CARD\_PARENT); 6 expect(cardsParent.children).toHaveLength( 7 CardsLength.RECOMMENDED\_CARDS\_MORE 8 ); 9 }); 10 11 it("Shows the right number of cards when expanding", () => { 12 render(<CardSection {...props} expanded={false} />); 13 fireEvent.click(screen.getByTestId(TestIds.SHOW\_MORE\_OR\_LESS\_BUTTON)); 14 const cardsParent = screen.getByTestId(TestIds.CARD\_PARENT); 15 expect(cardsParent.children).toHaveLength( 16 CardsLength.RECOMMENDED\_CARDS\_MORE 17 ); 18 }); 19 });

NO

```
1 describe('Card Section', () => {
2 it("Shows the right number of cards when clicking show more/less", () => {
3 // show more cards
4 fireEvent.click(screen.getByTestId(TestIds.SHOW_MORE_OR_LESS_BUTTON));
5 const cardsParent = screen.getByTestId(TestIds.CARD_PARENT);
6 expect(cardsParent.children).toHaveLength(
7 CardsLength.RECOMMENDED_CARDS_MORE
8 );
9
10 // show less cards
11 fireEvent.click(screen.getByTestId(TestIds.SHOW_MORE_OR_LESS_BUTTON));
12 const cardsParent = screen.getByTestId(TestIds.CARD_PARENT);
13 expect(cardsParent.children).toHaveLength(
14 CardsLength.RECOMMENDED_CARDS_LESS
15 );
16 });
```

<span id="page-31-0"></span>userEvent adds related event calls from browsers to make tests more realistic than its counterpart, fireEvent, a low-level API. See the appendix at the end to check how are the events from fireEvent mapped to userEvent.

You can read more about the motivation behind this change here: [eslint-plugin-testing-library/docs/rules/prefer-user-event.md](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-user-event.md) at main · t [esting-library/eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-user-event.md)

```
Examples
    YES
 1 // specifically
 2 await userEvent.click(closeBtn!);
 3
 4 // full example
 5 describe('CheckoutNotification', () => {
 6 it('dismisses notification on clicking close button', async () => {
 7 render(<CheckoutNotification {...defaultProps} hasCloseButton={true} />);
 8 const closeBtn = screen.queryByLabelText('close');
 9 await userEvent.click(closeBtn!);
10 expect(screen.queryByText(defaultProps.title)).toBeFalsy();
11 });
12 });
    NO
 1 // specifically don't do this
 2 fireEvent.click(closeBtn!);
 3
 4 // full example
 5 describe('CheckoutNotification', () => {
 6 it('dismisses notification on clicking close button', () => {
 7 render(<CheckoutNotification {...defaultProps} hasCloseButton={true} />);
 8 const closeBtn = screen.queryByLabelText('close');
 9 fireEvent.click(closeBtn!);
10 expect(screen.queryByText(defaultProps.title)).toBeFalsy();
11 });
12 });
```

# **General Guidelines**

- Aim for 90% unit test coverage, because we want comprehensive unit test coverage but there are often diminishing returns on testing the last 10% which are difficult to cover.
  - Set this up in your project's jest.config.js file in the coverageThreshold section:
- SAML single [sign-on](https://gitlab.com/chegginc/learning-services/web/chegg-web/-/blob/main/jest.config.js) for Chegg · GitLab
- Use mock utils instead of handcrafting mock objects getMockLessonUser, getMockUser, getMockLesson, etc.
  - Reasons:
    - Because this makes it easy to update all the mocks when the shape of our data changes.
    - Because DRY code is easier to maintain.
- <span id="page-31-1"></span>Unit tests should only verify contracts/public APIs work as expected, and not internal implementation details.

- Reasons: Because if the tests rely on internal implementation details they will break when the implementation changes.
- Use mocks when possible to avoid actually loading dependencies under test (You probably want to verify that it was called but don't want to actually run the function)
  - Reasons: Because if the tests are relying on the dependencies then they will break if dependencies break, and they are then testing the dependency instead of just the one module.
- Add 'data-test' with kebab-case values to elements so that the element is easier to find.

#### <span id="page-32-0"></span>**Every data test ID should be unique**

- Reasons:
  - We commonly use getByTestId which will throw if it finds a duplicate.
  - Having unique test IDs encourages clear and specific tests, and avoid mistakes where we think we are getting one element but really are getting something else.
  - How to ensure data test IDs are unique:
    - Any component rendered **outside** of a loop can have a unique, static data test ID assigned to it. Any component rendered **inside** of a loop should have a dynamic data test ID assigned to it so that there are no duplicate elements with the same data-test id. Here is an example:

Let's say we have one <TrackedButton> element. We should pass in a unique data test ID, and the <TrackedButton> should

```
accept the test id:
Examples
    YES
1 <div>
2 <TrackedButton data-test="add-course-submit-button">Add Course</TrackedButton>
3 </div>
4
    YES
 1 // If the <TrackedButton> is rendered inside a loop
 2 // and we would have multiple instances of the element, 
 3 // then the data test ID has to be dynamic 
 4 // so we don't have duplicates, like so:
 5 <div>
 6 {courses.map(course => {
 7 return (<TrackedButton data-test={`add-course-${course.name}`}>Add Course: {course.name}
    </TrackedButton>);
 8 })}
 9 </div>
10
    NO
1 // This will cause duplicate test IDs.
2 <div>
3 {courses.map(course => {
4 return (<TrackedButton data-test="add-course-submit-button">Add Course: {course.name}</TrackedButton>);
5 })}
6 </div>
```

# <span id="page-33-1"></span><span id="page-33-0"></span>**Integrated Tests using TestCafe**

## **General Guidelines**

- When a Jest unit test is deemed to be too complicated to write, use TestCafe for writing an integration test instead.
  - Reasons:
    - Chegg Web has strong infrastructure in place for TestCafe.
    - TestCafe tests are written in TypeScript, making them accessible to all our front end engineers as well as engineers in test.
- In your application package.json, add dev dependency : '@chegg/testcafe-framework' to utilize all the shared functions from a common repo.
- When installing the latest framework version in your team's repo, it seems like it's best to remove the dependency and then install the dependency again (this pulls in the latest libraries from the testcafe-framework). For example:

```
1 yarn remove @chegg/testcafe-framework -W -D
2 yarn add @chegg/testcafe-framework -W -D
```

- Follow further guidelines outlined in the documents below:
- Scaling FE Test [Automation:](https://chegg.atlassian.net/wiki/spaces/ARCH/pages/84644) TestCafe RFC
- Scaling test [automation](https://chegg.atlassian.net/wiki/spaces/~sshrimali@chegg.com/pages/3250451) Process **[ARCHIVED](https://chegg.atlassian.net/wiki/spaces/~sshrimali@chegg.com/pages/3250451)**

# **Example Test**

SAML single [sign-on](https://gitlab.com/chegginc/learning-services/web/chegg-web/-/blob/main/testcafe/tests/expertQnATests.ts) for Chegg · GitLab

# Storybook

<span id="page-33-2"></span>Props that change a component's view should be reproduced in Storybook using knobs instead of creating multiple stories, because this is more efficient and easy for the developer to use.

Examples

![](_page_33_Figure_17.jpeg)

```
YES
1 const stories = storiesOf('Message/MessageAttachment', module);
2 stories.add('MessageAttachment', () => {
3 const options = {
4 File: 'file',
5 Image: 'image'
6 };
7 // Knobs are used for props that will change component view
8 const defaultValue = options.File;
9 const fileName = text('File Name( if file type is file )', '');
10 const fileType = select('Select Attachment', options, defaultValue);
11 const fileUrl = text('File Url', '');
12 const initialState = {};
13 const mockStore: any = createMockStore({
14 initialState
15 });
16
17 return (
18 <Provider store={mockStore}>
19 <MessageAttachment
20 fileName={fileName}
21 fileType={fileType}
22 fileUrl={fileUrl}
23 showModal={action('openImageModal')}
```

```
24 onAttachmentLoad={noop}
25 />
26 </Provider>
27 );
28 });
```

NO

```
1 const stories = storiesOf('Message/MessageAttachment', module);
2 stories
3 .add('Message Attachment', () => {
4 const fileName = text('File Name( if file type is file )', '');
5 const initialState = {};
6 const mockStore: any = createMockStore({
7 initialState
8 });
9 return (
10 <Provider store={mockStore}>
11 <MessageAttachment
12 fileName={fileName}
13 fileType="file"
14 fileUrl=""
15 showModal={action('openImageModal')}
16 onAttachmentLoad={noop}
17 />
18 </Provider>
19 );
20 })
21 .add('Image Attachment', () => {
22 const fileUrl = text('File Url', '');
23 const initialState = {};
24 const mockStore: any = createMockStore({
25 initialState
26 });
27
28 return (
29 <Provider store={mockStore}>
30 <MessageAttachment
31 fileName=""
32 fileType="image"
33 fileUrl={fileUrl}
34 showModal={action('openImageModal')}
35 onAttachmentLoad={noop}
36 />
37 </Provider>
38 );
39 });
40
```

# Experiments and Feature Flags

### **Use Optimizely**

<span id="page-34-1"></span><span id="page-34-0"></span>We use [Optimizely](https://www.optimizely.com/) Full Stack for feature flags and experiments.

## <span id="page-35-0"></span>**Clean Up Old Experiments and Feature Flags**

When a new experiment or feature flag is created, we should create the ticket right away for cleaning up that flag or experiment from the code. Then, do complete this ticket ASAP after the feature flag or experiment is no longer in use. Because:

- Old feature flags and experiments add complexity and confusion.
- Using old feature flags and experiments adds to the bundle size to our FE codebase.
- Certain browsers (e.g. Firefox incognito) block Optimizely, so even if a feature is scaled to 100%, a portion of users will not see it until the Optimizely code is removed.

# Rule Template

# <span id="page-35-1"></span>**Short one sentence description using the `Heading 3` format**

(optional) a longer description which can include

- <span id="page-35-2"></span>Logic behind this rule
- Reasons

![](_page_35_Picture_10.jpeg)