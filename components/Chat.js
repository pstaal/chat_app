import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, Text, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      // username: '',
      messages: [],
      uid: 0,
      isConnected: false
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


  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
    
          this.setState({
            uid: user.uid ? user.uid : 11,
            isConnected: true,
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
          this.unsubscribeListUser = this.referenceMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.getMessages();
      }
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
      });
    });
    this.setState({
      messages,
    });
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }
  
  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage(messages[0]);
        this.saveMessages();
      })
  }

  // Arrow function
  addMessage = (messages) => {
    this.referenceMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: messages.user,
      image: messages.image || null,
      location: messages.location || null
    });
  }

  renderBubble = (props) => {
    return (
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
  
  renderInputToolbar = (props)=> {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }
  

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

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
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          showUserAvatar={true}
          renderUsernameOnMessage={true}
          renderAvatarOnTop={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: username,
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}