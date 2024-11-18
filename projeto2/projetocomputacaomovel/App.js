import * as React from 'react';
import { TextInput, Text, View, Button, Pressable, Modal, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tab = createBottomTabNavigator();

const RootStack = createNativeStackNavigator();

function menuInicio() {
  return (
    <tab.Navigator>
      <tab.Screen
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
      <tab.Screen
      name="Cadastro"
      component={MenuCadastro}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('./imagens/cadastro.png')} 
            style={{ width: size*1.2, height: size*1.2}}
          />
        ),
      }}
      />
      </tab.Navigator>
  );
}

function menuPrincipal(){
  return (
    <tab.Navigator>
      <tab.Screen
      name="Inicio"
      component={Inicio}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('./imagens/inicio.png')}
            style={{ width: size, height: size}}
          />
        ),
      }}
      />
      
      <tab.Screen
      name="Meu Carrinho"
      component={MeuCarrinho}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('./imagens/carrinho.png')}
            style={{ width: size, height: size}}
          />
        ),
      }}
      />
    </tab.Navigator>
  )
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
          await delay(1000);
          this.props.navigation.navigate("Inicio");
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

const categorias = [
   {nome: 'Alimentos', id: 1},
   {nome: 'Bebidas', id: 2},
   {nome: 'Higiene', id: 3},
   {nome: 'PetShop', id: 4},
];

const produtos = {
  alimentos: [ // Alimentos
    { id: '1', nome: 'Arroz', preco: 32.99, imagem: require('./imagens/arroz.png') },
    { id: '2', nome: 'Feijão', preco: 8.46, imagem: require('./imagens/feijao.png') },
    { id: '3', nome: 'Farinha Turbinada', preco: 10.99, imagem: require('./imagens/farinha.png') },
  ],
  bebidas: [ // Bebidas
    { id: '3', nome: 'Coca-Cola', preco: 11.49, imagem: require('./imagens/coca.png') },
    { id: '4', nome: 'Suco de Laranja', preco: 23.91, imagem: require('./imagens/suco.png') },
    { id: '5', nome: 'Red-Bull', preco: 9.99, imagem: require('./imagens/redbull.png') },
  ],
  higiene: [ // Higiene
    { id: '5', nome: 'Shamppo', preco: 26.499, imagem: require('./imagens/shamppo.png') },
    { id: '6', nome: 'Sabonete', preco: 4.99, imagem: require('./imagens/sabonete.png') },
    { id: '7', nome: 'Pasta de Dente', preco: 7.79, imagem: require('./imagens/pasta.png') },
  ],
  petshop: [ // PetShop
    { id: '7', nome: 'Ração para cachorro', preco: 79.93, imagem: require('./imagens/cachorro.png') },
    { id: '8', nome: 'Ração para gato', preco: 29.99, imagem: require('./imagens/gato.png') },
    { id: '9', nome: 'Brinquedo para cachorro', preco: 36.92, imagem: require('./imagens/brinquedo.png') },
  ]
};

class MeuCarrinho extends React.Component {
  render() {
    return (
      <Text>Carrinho</Text>
    );
  }
}

class Inicio extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Categorias</Text>
        <View style={styles.botaoContainer}>
          {categorias.map((categoria, indice) => (
            <TouchableOpacity
              key={indice}
              style={styles.botaoCategoria}
              onPress={() => this.props.navigation.navigate(categoria.nome)}>
              <Text>{categoria.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

class Alimentos extends React.Component {
    render(){
      const alimentos = produtos.alimentos;

      return (
        <ScrollView style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Setor de Alimentos</Text>
          {alimentos.map((produto) => (
            <View key={produto.id} style={styles.produto}>
              <Image source={produto.imagem} style={styles.imagemProduto} />
              <Text>{produto.nome}</Text>
              <Text>R$ {produto.preco}</Text>
              <TouchableOpacity style={styles.botaoProduto} onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }
}

class Bebidas extends React.Component {
    render(){
      const bebidas = produtos.bebidas;

      return (
        <ScrollView style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Setor de Bebidas</Text>
          {bebidas.map((produto) => (
            <View key={produto.id} style={styles.produto}>
              <Image source={produto.imagem} style={styles.imagemProduto} />
              <Text>{produto.nome}</Text>
              <Text>R$ {produto.preco}</Text>
              <TouchableOpacity style={styles.botaoProduto} onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }
}

class Higiene extends React.Component {
    render(){
      const limpeza = produtos.higiene;

      return (
        <ScrollView style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Setor de Higiene</Text>
          {limpeza.map((produto) => (
            <View key={produto.id} style={styles.produto}>
              <Image source={produto.imagem} style={styles.imagemProduto} />
              <Text>{produto.nome}</Text>
              <Text>R$ {produto.preco}</Text>
              <TouchableOpacity style={styles.botaoProduto} onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }
}

class PetShop extends React.Component {
    render(){
      const pets = produtos.petshop;

      return (
        <ScrollView style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Setor de PetShop</Text>
          {pets.map((produto) => (
            <View key={produto.id} style={styles.produto}>
              <Image source={produto.imagem} style={styles.imagemProduto} />
              <Text>{produto.nome}</Text>
              <Text>R$ {produto.preco}</Text>
              <TouchableOpacity style={styles.botaoProduto} onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }
}

class App extends React.Component{
  render(){
    return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={menuInicio} options={{ headerShown: false }} />
        <RootStack.Screen name="Inicio" component={menuPrincipal} options={{ headerShown: false }} />
        <RootStack.Screen name="Meu Carrinho" component={MeuCarrinho} options={{ headerShown: true }} />
          <RootStack.Screen name="Alimentos" component={Alimentos} options={{ headerShown: true }} />
          <RootStack.Screen name="Bebidas" component={Bebidas} options={{ headerShown: true }} />
          <RootStack.Screen name="Higiene" component={Higiene} options={{ headerShown: true }} />
          <RootStack.Screen name="PetShop" component={PetShop} options={{ headerShown: true }} />
      </RootStack.Navigator>
    </NavigationContainer>
    );
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
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: 20,
  },

  botaoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },

  botaoCategoria: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: 15,
        marginVertical: 10,
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        width: '80%',
        transition: 'background-color 0.3s',
  },

  produto: {
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
  },

  imagemProduto: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },

  botaoProduto: {
    backgroundColor: '#4CAF50',
    padding: 12,
    marginTop: 10,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    marginBottom: 30,
  },
});

export default App;
