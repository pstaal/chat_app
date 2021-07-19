import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground } from 'react-native';

const styles = StyleSheet.create({
  backGroundImage: {
    flex:1,
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  mainView: {
    width: '88%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  title: {
    fontSize: 45,
    fontWeight: 600,
    color: '#fff',
    alignSelf: 'center',
  },
  box: {
    height: '44%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  textInput: {
    width: '88%',
    alignSelf:'center',
    fontSize: 16,
    fontWeight: 300,
    color: '#757083',
    opacity: '50%',
    borderWidth: 2,
    borderColor: '#757083',
    height: 30,
  },
  backgroundText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 300,
    color: '#757083',
    opacity: '100%',
  },
  chatButton: {
    fontSize: 16,
    fontWeight: 300,
    color: '#fff',
    backgroundColor: '#757083',
    width: '88%',
  }
});

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  render() {
    return (
      <ImageBackground source={require('../assets/Background Image.png')} resizeMode="cover" style={styles.backGroundImage}>
      <View style={styles.mainView}>
        <Text style={styles.title}>App Title</Text>
        <View style={styles.box}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({name: text})}
          value={this.state.name}
          placeholder='Your Name'
          />
        <Text style={styles.backgroundText}>Choose Background Color.</Text>
        <Button
          style={styles.chatButton}
          title="Start chatting"
          onPress={()=>this.props.navigation.navigate('Chat', { name: this.state.name })}
        />
        </View>
      </View>
      </ImageBackground>
    )
  }
}