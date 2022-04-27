# Apollo Studio Embeddable Explorer

This repo hosts the source for Apollo Studio's Embeddable Explorer

[See docs for usage details](https://www.apollographql.com/docs/studio/embed-explorer/)

### Using the [@apollo/explorer npm package](https://www.npmjs.com/package/@apollo/explorer)

You can download the @apollo/explorer npm package with `npm install @apollo/explorer`. Then, you can import the ApolloExplorer class or ApolloExplorerReact component like so:

```
import { ApolloExplorer, ApolloExplorerReact } from '@apollo/explorer';
```

When you call the EmbeddedExplorer constructor with a `target` of an html div you have in your app, the Explorer will show up in an iframe in that element. Check out all the [configuration options](https://www.apollographql.com/docs/studio/explorer/embed-explorer/#options) for your graph.

#### React

```
import { ApolloExplorerReact } from '@apollo/explorer';

function App() {

  return (
    <ApolloExplorerReact
      target='#embeddableExplorer',
      graphRef='acephei@current',
      endpointUrl='https://acephei-gateway.herokuapp.com',
      initialState={{
        document: `query Example {
me {
  id
}
}`,
        variables: {
          test: 'abcxyz',
        },
        displayOptions: {
          showHeadersAndEnvVars: true,
        },
      }}
    />
  );
}
```

#### Vanilla JS

```
import { ApolloExplorer } from '@apollo/explorer';

function App() {

  ...
  new ApolloExplorer({
      target: '#embeddableExplorer',
      graphRef: 'acephei@current',
      endpointUrl: 'https://acephei-gateway.herokuapp.com',
      initialState: {
        document: `query Example {
me {
  id
}
}`,
        variables: {
          test: 'abcxyz',
        },
        displayOptions: {
          showHeadersAndEnvVars: true,
        },
      },
  })
  ...

}

```

### Examples from the raw cdn hosted umd file

- [Embedding a registered public graph](./src/examples/graphRef.html)
- [Usage by directly passing in schema](./src/examples/manualSchema.html)

## Developing

run `npm run build:umd` to build umd files where EmbeddedExplorer is exposed on window.

Open `examples/localDevelopmentExample.html` to test your changes. (if origin is not set, run localDevelopmentExample.html from `Live Server`)

Install the `Live Server` extension on VSCode, then go to `localDevelopmentExample.html` and click 'Go Live'
<img width="279" alt="Screen Shot 2022-04-27 at 4 34 53 PM" src="https://user-images.githubusercontent.com/16390269/165626464-8252abcd-2577-4d97-90a8-f487da807a64.png">



run `npm run build:cjs-esm` to build cjs & esm files where ApolloExplorer & ApolloExplorerReact are named exports.
