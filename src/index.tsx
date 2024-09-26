import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { setContext } from '@apollo/client/link/context'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API + '/graphql/',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY,
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  /* rootElement, */
)

reportWebVitals()
