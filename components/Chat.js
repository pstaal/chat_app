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
    };
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: `${name}! has just entered the chat.`,
          createdAt: new Date(),
          system: true,
         },
        {
          _id: 2,
          text: `Hello ${name}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
      ]
    });
  }

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