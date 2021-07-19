import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Svg, {
  Use,
  Image,
} from 'react-native-svg';

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
  picture: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  inputBox: {
    width: '88%',
    alignSelf:'center',
    padding: 5,
    fontSize: 16,
    height: 40,
    fontWeight: 300,
    color: '#757083',
    opacity: '50%',
    borderWidth: 2,
    borderColor: '#757083',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {
    fontSize: 16,
    fontWeight: 300,
    height: 30,
    color: '#757083',
    opacity: '50%',
    border: 'none',
    flex: 1,
    outlineStyle: 'none',
  },
  backGroundView: {
    width: '88%',
    alignSelf: 'center',
  }, 
  backgroundText: {
    justifyContent: 'flex-start',
    fontSize: 16,
    fontWeight: 300,
    color: '#757083',
    opacity: '100%',
  },
  boxHolder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  box1: {
   width: 50,
   height: 50,
   borderRadius: 25,
   backgroundColor: '#090C08',
   marginRight: 30,
   marginTop: 25,
   color: '#090C08',
  },
  box2: {
   width: 50,
   height: 50,
   borderRadius: 25,
   backgroundColor: '#474056',
   marginRight: 30,
   marginTop: 25,
   color: '#474056',
  },
  box3: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8A95A5',
    marginRight: 30,
    marginTop: 25,
    color: '#8A95A5',
  },
  box4: {
   width: 50,
   height: 50,
   borderRadius: 25,
   backgroundColor: '#B9C6AE',
   marginTop: 25,
   color: '#B9C6AE',
  },
  active: {
    outlineColor: 'inherit',
    outlineStyle: 'solid',
    outLineWidth: 2,
    outLineOffset: 2,
  },
  button: {
    backgroundColor: '#757083',
    width: '88%',
    height: 40,
    alignItems: "center",
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 300,
  }
});

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: '#090C08'};
  }


  render() {
    return (
      <ImageBackground source={require('../assets/Background Image.png')} resizeMode="cover" style={styles.backGroundImage}>
      <View style={styles.mainView}>
        <Text style={styles.title}>App Title</Text>
        <View style={styles.box}>
        <View style={styles.inputBox}>
        <Svg style={styles.picture}>
     <Image href={require('../assets/icon.svg')} />
        </Svg>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({name: text})}
          value={this.state.name}
          placeholder='Your Name'
          />
        </View>
        <View style={styles.backGroundView}> 
        <Text style={styles.backgroundText}>Choose Background Color.</Text>
        <View style={styles.boxHolder}>
          <TouchableOpacity style={styles.box1.backgroundColor===this.state.color ? [styles.box1, styles.active] : styles.box1} onPress={()=> this.setState({color: '#090C08'})}></TouchableOpacity>
          <TouchableOpacity style={styles.box2.backgroundColor===this.state.color ? [styles.box2, styles.active] : styles.box2} onPress={()=> this.setState({color: '#474056'})}></TouchableOpacity>
          <TouchableOpacity style={styles.box3.backgroundColor===this.state.color ? [styles.box3, styles.active] : styles.box3} onPress={()=> this.setState({color: '#8A95A5'})}></TouchableOpacity>
          <TouchableOpacity style={styles.box4.backgroundColor===this.state.color ? [styles.box4, styles.active] : styles.box4} onPress={()=> this.setState({color: '#B9C6AE'})}></TouchableOpacity>
        </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={()=>this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
        >
        <Text style={styles.textButton}>Start Chatting</Text>
        </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    )
  }
}