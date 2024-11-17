import * as React from 'react';
import { TextInput, Text, View, Button, Pressable, Modal, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

const homeTabs = createBottomTabNavigator();

const RootStack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <homeTabs.Navigator>
        <homeTabs.Screen
      name="Login"
      component={MenuLogin}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('./imagens/login.png')}
            style={{ width: size*2.4, height: size*2.4}}
          />
        ),
      }}
      />
      <homeTabs.Screen
      name="Cadastro"
      component={MenuLogin}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('./imagens/cadastro.png')} 
            style={{ width: size*1.2, height: size*1.2}}
          />
        ),
      }}
      />
      </homeTabs.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <RootStack.Screen name="Teste" component={Pagina02} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

class MenuLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
      senha: '',
      showModal: false,
      modalMessage: '',
    };
  }

  // Verifica o login informado pelo usuario
  async ler() {
    try {
      const { usuario, senha } = this.state;

      if (!usuario || !senha) {
        this.setState({
          showModal: true,
          modalMessage: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      let savedPassword = await AsyncStorage.getItem(usuario); 
      if (savedPassword != null) {
        if (savedPassword === senha) {
          this.setState({
            showModal: true,
            modalMessage: 'Login feito com sucesso!',
          });
          this.props.navigation.navigate("Teste");
        } else {
          this.setState({
            showModal: true,
            modalMessage: 'Senha incorreta!',
          });
        }
      } else {
        this.setState({
          showModal: true,
          modalMessage: 'Usuário não cadastrado!',
        });
      }
    } catch (erro) {
      console.log('Erro ao tentar realizar o login:', erro);
    }
  }

  render() {
    return (
      <View>
        <Text>Usuário:</Text>
        <TextInput
          onChangeText={(texto) => this.setState({ usuario: texto })}
          value={this.state.usuario}
        />
        <Text>Senha:</Text>
        <TextInput
          onChangeText={(texto) => this.setState({ senha: texto })}
          value={this.state.senha}
          secureTextEntry
        />
        <Button title="Logar" onPress={() => this.ler()} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            this.setState({ showModal: false });
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.modalMessage}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setState({ showModal: false })}>
                <Text style={styles.textStyle}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class MenuCadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      showModal: false,
      modalMessage: '',
    };
  }

  async gravar() {
    try {
      if (!this.state.user || !this.state.password) {
        this.setState({
          showModal: true,
          modalMessage: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      await AsyncStorage.setItem(this.state.user, this.state.password);
      this.setState({
        showModal: true,
        modalMessage: 'Cliente cadastrado com sucesso!',
      });
    } catch (erro) {
      this.setState({
        showModal: true,
        modalMessage: 'Erro ao cadastrar!',
      });
    }
  }

  render() {
    return (
      <View>
        <Text>Cadastrar Usuário:</Text>
        <TextInput
          onChangeText={(texto) => this.setState({ user: texto })}
          value={this.state.user}
        />
        <Text>Cadastrar Senha:</Text>
        <TextInput
          onChangeText={(texto) => this.setState({ password: texto })}
          value={this.state.password}
          secureTextEntry
        />
        <Button title="Cadastrar" onPress={() => this.gravar()} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            this.setState({ showModal: false });
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.modalMessage}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setState({ showModal: false })}>
                <Text style={styles.textStyle}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class Pagina02 extends React.Component{
  render(){
    return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"Página 02!!!"}</Text>
      <Button title="Voltar" onPress={()=>this.props.navigation.goBack()}></Button>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
