import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
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
            {Object.values(toDos).reverse().map(toDo => 
            <ToDo 
            key={toDo.id} 
            deleteToDo={this._deleteToDo} 
            uncompleteToDo={this._uncompleteToDo} 
            completeToDo={this._completeToDo}
            updateToDo={this._updateToDo}
            {...toDo}></ToDo>)}

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
  _loadedToDos = async () => {
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      console.log(toDos);
      setTimeout(() => 
      this.setState({
        loadedToDos:true,
        toDos: parsedToDos || {}
      }),2000);

    } catch(err) {
      console.log(err);
    }


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
            ...addToDoObject,
            ...prevState.toDos

          }

        };
        this._saveToDos(newState.toDos);
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
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });

  };
  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });

  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
  _saveToDos = addToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(addToDos));
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
