import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  
});




export default class Chat extends React.Component {

  componentDidMount() {
    this.props.navigation.setOptions({ title: name });
  };
  
  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
        <Text style={{color: '#fff'}}>Let's start chatting!</Text>
      </View>
    )
  }
}