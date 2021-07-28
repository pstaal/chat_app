import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, Text, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
const firebase = require('firebase');
require('firebase/firestore');
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      // username: '',
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
    // // fix timer warning....you can ignore this for now
    // LogBox.ignoreLogs([
    //   'Setting a timer'
    // ]);
  }
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      console.log(user, 'inside usercomponentdidmount++++++', user.uid);
      this.setState({
        // username: this.props.route.params.name,
        //set valid uuid because first mount has no user
        uid: user.uid ? user.uid : 11,
        messages: [{
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          }
        }],
      });
      //already initialised in constructor this.referenceMessages
      // this.referenceMessages = firebase.firestore().collection('messages');
      // console.log(this.referenceMessageUser, 'collection inside componentdidmount');
      // listen for collection changes for current user 
      this.unsubscribeListUser = this.referenceMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
    });
  }
  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeListUser();
  }
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        user: data.user,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        // not sure why you are passing uuid here, should be id
        // uid: data.uid,
      });
    });
    this.setState({
      messages,
    });
  }
  // Should be arrow function, otherwise bind it
  onSend = (messages = []) => {
    console.log(messages, 'messages inside onSend*****');
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState, messages),
    }),
      () => {
        this.addMessage(messages[0]);
      })
  }
  // Arrow function
  addMessage = (messages) => {
    this.referenceMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: messages.user,
    });
  }
  renderBubble = (props) => {
    console.log(props, 'from inside renderbubble')
    return (
      //This may not be required
      // <Text style={{ color: '#fff' }}>{props.currentMessage.user.name}</Text>
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#164021',
            color: '#FFF'
          },
          left: {
            backgroundColor: '#cccfcd',
          }
        }
        }
      />
    )
  }
  render() {
    let color = this.props.route.params.color;
    const username = this.props.route.params.name;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              style={{ flex: '50%' }}
            />
          )}
          renderBubble={this.renderBubble}
          showUserAvatar={true}
          renderUsernameOnMessage={true}
          renderAvatarOnTop={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          //user must be set automatically not manually
          user={{
            _id: this.state.uid,
            name: username,
            //you can add avatart
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}