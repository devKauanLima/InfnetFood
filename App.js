import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch, Alert, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import MapView, { Marker } from 'react-native-maps';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppContext = createContext();

const CATEGORIAS = [
  { id: '1', nome: 'Lanches' },
  { id: '2', nome: 'Bebidas' },
  { id: '3', nome: 'Sobremesas' },
];

const PRODUTOS = {
  '1': [
    { id: 'p1', nome: 'Hambúrguer Clássico', preco: 25.90 },
    { id: 'p2', nome: 'Cheeseburger Duplo', preco: 32.50 },
  ],
  '2': [
    { id: 'p3', nome: 'Refrigerante Cola', preco: 8.00 },
    { id: 'p4', nome: 'Suco de Laranja', preco: 10.00 },
  ],
  '3': [
    { id: 'p5', nome: 'Sorvete de Baunilha', preco: 15.00 },
    { id: 'p6', nome: 'Pudim', preco: 12.00 },
  ],
};

const RESTAURANTES = [
  { id: 'r1', nome: 'Restaurante Central', endereco: 'Rua da Carioca, 10 - Centro', item: 'Feijoada Completa', lat: -22.9068, lng: -43.1729 },
  { id: 'r2', nome: 'Lanchonete do Zé', endereco: 'Av. Rio Branco, 156 - Centro', item: 'Salgados Diversos', lat: -22.9000, lng: -43.1770 },
  { id: 'r3', nome: 'Pizzaria Bella', endereco: 'Rua Sete de Setembro, 45 - Centro', item: 'Pizza Margherita', lat: -22.9050, lng: -43.1750 },
  { id: 'r4', nome: 'Bistrô Carioca', endereco: 'Rua do Ouvidor, 130 - Centro', item: 'Bife à Parmegiana', lat: -22.9030, lng: -43.1740 },
  { id: 'r5', nome: 'Sushi Centro', endereco: 'Rua da Assembleia, 10 - Centro', item: 'Combo Salmão', lat: -22.9045, lng: -43.1760 },
  { id: 'r6', nome: 'Cantina Italiana', endereco: 'Av. Nilo Peçanha, 50 - Centro', item: 'Macarronada', lat: -22.9075, lng: -43.1735 },
  { id: 'r7', nome: 'Boteco Raiz', endereco: 'Rua Uruguaiana, 100 - Centro', item: 'Petiscos', lat: -22.9025, lng: -43.1780 },
  { id: 'r8', nome: 'Vegan Food', endereco: 'Rua Primeiro de Março, 20 - Centro', item: 'Hambúrguer de Grão de Bico', lat: -22.9010, lng: -43.1755 },
  { id: 'r9', nome: 'Churrascaria Centro', endereco: 'Rua Buenos Aires, 80 - Centro', item: 'Rodízio', lat: -22.9035, lng: -43.1790 },
  { id: 'r10', nome: 'Doce Vida', endereco: 'Rua Gonçalves Dias, 30 - Centro', item: 'Torta de Limão', lat: -22.9055, lng: -43.1775 },
];

const PEDIDOS_MOCK = [
  { id: 'ped1', data: '12/10/2023', total: 45.90, status: 'Entregue' },
  { id: 'ped2', data: '15/10/2023', total: 32.50, status: 'Em preparo' },
];

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const login = (email) => setUser({ name: 'Usuário Padrão', email });
  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product, quantity) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{ user, login, logout, cart, addToCart, clearCart, isDark, setIsDark }}>
      {children}
    </AppContext.Provider>
  );
};

const getThemeStyles = (isDark) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#121212' : '#f5f5f5', padding: 16 },
  text: { color: isDark ? '#ffffff' : '#000000', fontSize: 16 },
  title: { color: isDark ? '#ffffff' : '#000000', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: isDark ? '#1e1e1e' : '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  input: { backgroundColor: isDark ? '#333333' : '#ffffff', color: isDark ? '#ffffff' : '#000000', borderWidth: 1, borderColor: isDark ? '#555' : '#ccc', padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#e74c3c', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

const LoginScreen = () => {
  const { login, isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    login(email);
  };

  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <Text style={[styles.title, { textAlign: 'center' }]}>InfnetFood</Text>
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={isDark ? '#999' : '#666'} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={isDark ? '#999' : '#666'} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <FlatList
        data={CATEGORIAS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Products', { categoryId: item.id, categoryName: item.nome })}>
            <Text style={styles.text}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ProductsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const { isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);
  const produtos = PRODUTOS[categoryId] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Text style={styles.text}>{item.nome}</Text>
            <Text style={styles.text}>R$ {item.preco.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);
  const [quantity, setQuantity] = useState(1);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start(() => {
      addToCart(product, quantity);
      Alert.alert('Sucesso', 'Item adicionado ao carrinho!');
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.nome}</Text>
      <Text style={[styles.text, { marginBottom: 20 }]}>Preço: R$ {product.preco.toFixed(2)}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity style={[styles.button, { padding: 10 }]} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.text, { marginHorizontal: 20, fontSize: 20 }]}>{quantity}</Text>
        <TouchableOpacity style={[styles.button, { padding: 10 }]} onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { cart, isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);
  const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>
      {cart.length === 0 ? (
        <Text style={styles.text}>Seu carrinho está vazio.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.text}>{item.nome} (x{item.quantity})</Text>
                <Text style={styles.text}>R$ {(item.preco * item.quantity).toFixed(2)}</Text>
              </View>
            )}
          />
          <Text style={[styles.title, { marginTop: 10 }]}>Total: R$ {total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.buttonText}>Finalizar Pedido</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const CheckoutScreen = ({ navigation }) => {
  const { clearCart, isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState('');

  useEffect(() => {
    if (cep.length === 8) {
      buscarCep();
    }
  }, [cep]);

  const buscarCep = async () => {
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const logradouro = data.logradouro ? `${data.logradouro}, ` : '';
        const bairro = data.bairro ? `${data.bairro}, ` : '';
        setEndereco(`${logradouro}${bairro}${data.localidade} - ${data.uf}`);
      } else {
        Alert.alert('Aviso', 'CEP não encontrado.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao buscar CEP');
    }
  };

  const confirmarPedido = async () => {
    if (!endereco || !pagamento) {
      Alert.alert('Aviso', 'Preencha o endereço e método de pagamento.');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pedido Confirmado! 🍔',
        body: 'Seu pedido foi recebido e está em preparo.',
      },
      trigger: null,
    });
    clearCart();
    Alert.alert('Sucesso', 'Pedido finalizado com sucesso!');
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <TextInput 
        style={styles.input} 
        placeholder="CEP (Apenas números)" 
        placeholderTextColor={isDark ? '#999' : '#666'} 
        value={cep} 
        onChangeText={setCep} 
        keyboardType="numeric"
        maxLength={8}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Endereço de Entrega" 
        placeholderTextColor={isDark ? '#999' : '#666'} 
        value={endereco} 
        onChangeText={setEndereco} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Método de Pagamento (ex: Cartão, Pix)" 
        placeholderTextColor={isDark ? '#999' : '#666'} 
        value={pagamento} 
        onChangeText={setPagamento} 
      />
      <TouchableOpacity style={styles.button} onPress={confirmarPedido}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileScreen = () => {
  const { user, logout, isDark, setIsDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Nome: {user.name}</Text>
        <Text style={styles.text}>E-mail: {user.email}</Text>
      </View>
      <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.text}>Tema Escuro</Text>
        <Switch value={isDark} onValueChange={setIsDark} />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#555' }]} onPress={logout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const OrdersScreen = () => {
  const { isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pedidos</Text>
      <FlatList
        data={PEDIDOS_MOCK}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Data: {item.data}</Text>
            <Text style={styles.text}>Total: R$ {item.total.toFixed(2)}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const MapScreen = ({ navigation }) => {
  const { isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurantes Parceiros</Text>
      <View style={{ height: 250, width: '100%', marginBottom: 16, borderRadius: 8, overflow: 'hidden' }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: -22.9050,
            longitude: -43.1750,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {RESTAURANTES.map(rest => (
            <Marker
              key={rest.id}
              coordinate={{ latitude: rest.lat, longitude: rest.lng }}
              title={rest.nome}
              description={rest.item}
            />
          ))}
        </MapView>
      </View>
      <FlatList
        data={RESTAURANTES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}>
            <Text style={styles.text}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  const { isDark } = useContext(AppContext);
  const styles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.nome}</Text>
      <View style={styles.card}>
        <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 8 }]}>Endereço:</Text>
        <Text style={[styles.text, { marginBottom: 16 }]}>{restaurant.endereco}</Text>
        <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 8 }]}>Exemplo do Cardápio:</Text>
        <Text style={styles.text}>{restaurant.item}</Text>
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Início' }} />
    <Stack.Screen name="Products" component={ProductsScreen} options={({ route }) => ({ title: route.params.categoryName })} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Detalhes' }} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'Carrinho' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar Pedido' }} />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MapMain" component={MapScreen} options={{ title: 'Mapa' }} />
    <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} options={{ title: 'Restaurante' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user } = useContext(AppContext);

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#e74c3c' }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Mapa" component={MapStack} />
      <Tab.Screen name="Carrinho" component={CartStack} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} options={{ headerShown: true }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}