import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat'

const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
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
          user: {
            _id : data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
          },
          text: data.text,
          createdAt: new Date().toDateString(),
          uid: data.uid,
        });
    });
    this.setState({ 
      messages,
   });
  }

  onSend(messages = []) {
    this.addMessage(messages);
  }

  renderBubble(props) {
    console.log(props, 'from inside renderbubble')
    return (
      <View>
      <Text style={{color: '#fff'}}>{props.currentMessage.user.name}</Text>
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
      </View>
    )
  }

  addMessage(messages) {
    console.log(messages, 'inside add messages')
    this.referenceMessages.add({
      user: {
        _id : messages[0].user._id,
        name: this.state.username,
        avatar: 'https://placeimg.com/140/140/any'
      },
      text: messages[0].text,
      createdAt: messages[0].createdAt,
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
        username: this.props.route.params.name,
        uid: user.uid,
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
      this.referenceMessages = firebase.firestore().collection('messages');
      console.log(this.referenceMessageUser, 'collection inside componentdidmount');
      // listen for collection changes for current user 
      this.unsubscribeListUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
      console.log(this.state, 'state inside componentDidmout');

    });
  }

    componentWillUnmount() {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribeListUser();
    }

  render() {
    let color = this.props.route.params.color;
    console.log(this.state.messages, 'inside render');

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
        <GiftedChat
           renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            style={{flex: '50%'}}
          />
        )}
          renderBubble={this.renderBubble.bind(this)}
          showUserAvatar={true}
          renderUsernameOnMessage={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{_id: 1}}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}