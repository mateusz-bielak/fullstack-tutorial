import React from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import Login from './pages/login';
import Pages from './pages';
import injectStyles from './styles';
import { resolvers, typeDefs } from './resolvers';

const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

const cache = new InMemoryCache();
cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: [],
    },
});

const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: {
        authorization: localStorage.getItem('token'),
    },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
});

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();

ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root'),
);
