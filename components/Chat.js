import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0
    };
    
      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: "AIzaSyBVQ9XCGuveRw-ke7k3Vjn_8yut6VIZa90",
          authDomain: "test-cd62a.firebaseapp.com",
          projectId: "test-cd62a",
          storageBucket: "test-cd62a.appspot.com",
          messagingSenderId: "738041402900",
          appId: "1:738041402900:web:bdd4e7c6af8c5bb682b901",
          measurementId: "G-M78B0CSS8L"
        });
      }
      this.referenceMessages = firebase.firestore().collection('messages');
   
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        user: data.user,
        text: data.text,
        createdAt: data.createdAt
      });
    });
    this.setState({ 
      messages,
   });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.addMessage(messages);
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
            color: 'white',
            alignSelf: 'stretch',
            marginLeft: 0,
          },
          left: {
            alignSelf: 'stretch',
            marginRight: 0,
          }
        }}
      />
    )
  }

  addMessage(messages) {
    this.referenceMessages.add({
      user: messages.user,
      text: messages.text,
      createdAt: messages.createdAt,
      uid: this.state.uid,
    });

  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: []
      });
      this.referenceMessageUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
      // listen for collection changes for current user 
      this.unsubscribeListUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate);

    });
  }

    componentWillUnmount() {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribeListUser();
    }

    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: `${name}! has just entered the chat.`,
    //       createdAt: new Date(),
    //       system: true,
    //      },
    //     {
    //       _id: 2,
    //       text: `Hello ${name}!`,
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //      },
    //   ]
    // });
  // }

  render() {
    let color = this.props.route.params.color;
    

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{_id: 1,}}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}