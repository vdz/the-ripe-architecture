# Adjustments

Changes to the best practices section should be derived from the following list. Once changes are made, the done issues should be striken thru.

## Change
1. Types & interfaces should be defined in a different `types.ts` file adjascent to where it's used.
2. Components should not have have a simple declarative return statement as soon as possible in the component.
3. JSX return statement should not contain HTML tags and implementation detail, only Styled components with a clear semantic name like `<CustomeListWrapper>`