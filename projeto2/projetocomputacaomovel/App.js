import * as React from 'react';
import { TextInput, Text, View, Button, Pressable, Modal, StyleSheet, TouchableOpacity, Image, ScrollView, Vibration } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

// Carrinho como state global usando Context
const CarrinhoContext = React.createContext();

const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = React.useState([]);

  React.useEffect(() => {
    // Carregar carrinho do AsyncStorage quando o app iniciar
    const carregarCarrinho = async () => {
      try {
        const carrinhoSalvo = await AsyncStorage.getItem('carrinho');
        if (carrinhoSalvo !== null) {
          setCarrinho(JSON.parse(carrinhoSalvo));
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    };
    carregarCarrinho();
  }, []);

  // Função para adicionar produto ao carrinho
  const adicionarAoCarrinho = async (produto) => {
    try {
      const novoCarrinho = [...carrinho, produto];
      setCarrinho(novoCarrinho);
      await AsyncStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      Vibration.vibrate(100); // Vibrar por 100ms
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  // Função para limpar o carrinho
  const limparCarrinho = async () => {
    try {
      setCarrinho([]);
      await AsyncStorage.removeItem('carrinho');
      Vibration.vibrate(200); // Vibrar por 200ms
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarAoCarrinho, limparCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

// Função para exibir produtos de uma categoria
const CategoriaPage = ({ route, navigation }) => {
  const { categoria } = route.params;
  const { adicionarAoCarrinho } = React.useContext(CarrinhoContext);

  const produtos = {
    alimentos: [
      { id: '1', nome: 'Arroz', preco: 32.99, imagem: require('./imagens/arroz.png') },
      { id: '2', nome: 'Feijão', preco: 8.46, imagem: require('./imagens/feijao.png') },
      { id: '3', nome: 'Farinha Turbinada', preco: 10.99, imagem: require('./imagens/farinha.png') },
    ],
    bebidas: [
      { id: '3', nome: 'Coca-Cola', preco: 11.49, imagem: require('./imagens/coca.png') },
      { id: '4', nome: 'Suco de Laranja', preco: 23.91, imagem: require('./imagens/suco.png') },
      { id: '5', nome: 'Red-Bull', preco: 9.99, imagem: require('./imagens/redbull.png') },
    ],
    higiene: [
      { id: '5', nome: 'Shamppo', preco: 26.499, imagem: require('./imagens/shamppo.png') },
      { id: '6', nome: 'Sabonete', preco: 4.99, imagem: require('./imagens/sabonete.png') },
      { id: '7', nome: 'Pasta de Dente', preco: 7.79, imagem: require('./imagens/pasta.png') },
    ],
    petshop: [
      { id: '7', nome: 'Ração para cachorro', preco: 79.93, imagem: require('./imagens/cachorro.png') },
      { id: '8', nome: 'Ração para gato', preco: 29.99, imagem: require('./imagens/gato.png') },
      { id: '9', nome: 'Brinquedo para cachorro', preco: 36.92, imagem: require('./imagens/brinquedo.png') },
    ],
  };

  const categoriaProdutos = produtos[categoria];

  return (
    <ScrollView>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Produtos de {categoria}</Text>
      {categoriaProdutos.map((produto) => (
        <View key={produto.id} style={styles.produtoItem}>
          <Image source={produto.imagem} style={styles.produtoImagem} />
          <Text>{produto.nome}</Text>
          <Text>Preço: R${produto.preco}</Text>
          <TouchableOpacity
            style={styles.botaoProduto}
            onPress={() => adicionarAoCarrinho(produto)}>
            <Text style={styles.botaoTexto}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

// Tela de Carrinho
const MeuCarrinho = () => {
  const { carrinho, limparCarrinho } = React.useContext(CarrinhoContext);

  const finalizarCompra = async () => {
    await limparCarrinho();
    alert('Compra Finalizada!');
  };

  if (carrinho.length === 0) {
    return (
      <View style={styles.carrinhoVazio}>
        <Text style={{ fontSize: 18 }}>O seu carrinho está vazio</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.carrinhoContainer}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Itens no Carrinho</Text>
      {carrinho.map((produto, index) => (
        <View key={index} style={styles.produtoCarrinho}>
          <Image source={produto.imagem} style={styles.produtoImagem} />
          <Text>{produto.nome}</Text>
          <Text>Preço: R${produto.preco}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.botaoProduto} onPress={finalizarCompra}>
        <Text style={styles.botaoTexto}>Finalizar Compra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Tela de Login
const MenuLogin = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const handleLogin = () => {
    Vibration.vibrate(100);
    navigation.replace('Inicio');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => {
          Vibration.vibrate(100);
          navigation.navigate('Cadastro');
        }}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
};

// Tela de Cadastro
const MenuCadastro = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const handleCadastro = () => {
    Vibration.vibrate(100);
    navigation.replace('Inicio');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Função de navegação do menu principal
const menuPrincipal = () => {
  return (
    <tab.Navigator>
      <tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./imagens/inicio.png')}
              style={{ width: size, height: size }}
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
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </tab.Navigator>
  );
};

// Página inicial com as categorias
const Inicio = ({ navigation }) => {
  const categorias = [
    { nome: 'Alimentos', id: 'alimentos' },
    { nome: 'Bebidas', id: 'bebidas' },
    { nome: 'Higiene', id: 'higiene' },
    { nome: 'PetShop', id: 'petshop' },
  ];

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Selecione uma categoria:</Text>
      {categorias.map((categoria) => (
        <TouchableOpacity
          key={categoria.id}
          style={styles.categoriaButton}
          onPress={() => {
            Vibration.vibrate(100);
            navigation.navigate('Categoria', { categoria: categoria.id });
          }}>
          <Text>{categoria.nome}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function App() {
  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Login" component={MenuLogin} />
          <RootStack.Screen name="Cadastro" component={MenuCadastro} />
          <RootStack.Screen name="Inicio" component={menuPrincipal} />
          <RootStack.Screen name="Categoria" component={CategoriaPage} />
        </RootStack.Navigator>
      </NavigationContainer>
    </CarrinhoProvider>
  );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 10,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    color: '#0066CC',
    marginTop: 10,
  },
  produtoItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
  produtoImagem: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  botaoProduto: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  produtoCarrinho: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
  carrinhoVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carrinhoContainer: {
    padding: 20,
  },
  categoriaButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
});
