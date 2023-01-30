import { ThemeProvider } from 'styled-components'

import React, { useState, useEffect, Component } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";



import { Provider  } from 'mobx-react'
import { observer,  } from 'mobx-react'

import AppStore from './store'
import colors from 'tailwindcss/colors' 
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

import Header from './Header'
import Search from './Search'
import Pricing from './Pricing' // <--- Add this line

import Dashboard from './Dashboard'

import Tool from './Core/Tool'
import Chat from './Core/Chat'

import Login from './Login/Login'

import Profile from './Profile/'
import LoginSuccess from './Login/Success'


import './App.scss'

if(!window.store){
  window.store = new AppStore();
}


const App = ({ signOut }) => {

  const [notes, setNotes] = useState([]);

  // useEffect(() => {
  //   fetchNotes();
  // }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <ThemeProvider theme={colors}>
      <Provider store={window.store}>
        <Router>
              <Switch>
                    <Route path="/writing/document"><div/></Route>
                    <Route component={Header} />
                </Switch>
                <Switch>
                    <Route path="/writing/document"><div/></Route>
                    <Route component={Tool} />
                </Switch>
          </Router>
          <Button onClick={signOut}>Sign Out</Button>
      </Provider>
      
    </ThemeProvider>
  );
};

export default withAuthenticator(App);
// export default App