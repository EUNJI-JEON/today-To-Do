import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import { AppLoading} from "expo";
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";

const { height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    addToDo: "",
    loadedToDos: false,
    toDos: {}
  };
  componentDidMount = () => {
    this._loadedToDos();
  }
  render() {
    const { addToDo, loadedToDos, toDos } = this.state;
    console.log(toDos);
    if(!loadedToDos){
      return <AppLoading></AppLoading>;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Today To Do</Text>
        <View style={styles.card}>
          <TextInput 
          style={styles.input} 
          placeholder={"Add to do"} 
          value={addToDo} 
          onChangeText={this._controlAddToDo} 
          placeholderTextColor={"#999"} 
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={this._addToDo}>

          </TextInput>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(toDo => <ToDo key={toDo.id} {...toDo} deleteToDo={this._deleteToDo}></ToDo>)}

          </ScrollView>
        </View>
      </View>
    );
  }
  _controlAddToDo = text => {
    this.setState({
      addToDo: text
    });
  };
  _loadedToDos = () => {
    this.setState({
      loadedToDos:true
    });

  };
  _addToDo = () => {
    const {addToDo} = this.state;
    if(addToDo !== ""){
      this.setState(prevState => {
        const ID= uuidv1();
        const addToDoObject ={
          [ID]:{
            id:ID,
            isCompleted: false,
            text: addToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          addToDo: "",
          toDos: {
            ...prevState.toDos,
            ...addToDoObject
          }

        };
        return {...newState};
      });

    }
  };
  _deleteToDo= (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      return {...newState};
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30

  },
  card:{
    backgroundColor: "white",
    flex:1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:{
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset:{
          height: -1,
          width:0
        }

      },
      android:{
        elevation:3

      }
    })

  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems : "center"
  }
});
