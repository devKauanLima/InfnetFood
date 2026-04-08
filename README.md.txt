# 🍔 InfnetFood - App de Pedidos e Delivery

Aplicativo desenvolvido em React Native para pedidos e delivery de lanches e refeições. Este projeto é a entrega final (Assessment - AT) da disciplina de **Desenvolvimento Mobile com React Native**, do Bloco de Desenvolvimento Front-end com Frameworks.

## ✨ Funcionalidades Implementadas

* **Fluxo de Autenticação:** Login simulado dividindo o app em área pública e área logada.
* **Navegação Dinâmica:** Utilização de Stack Navigation e Bottom Tabs Navigation.
* **Catálogo de Produtos:** Listagem de categorias e produtos em formato de scroll utilizando `FlatList`.
* **Carrinho de Compras:** Adição de itens, controle de quantidade e cálculo automático do valor total com feedback visual (animações e Alerts).
* **Checkout Inteligente:** Consumo da API pública ViaCEP para preenchimento automático do endereço de entrega.
* **Notificações:** Emissão de notificação local simulando o status de confirmação do pedido utilizando `expo-notifications`.
* **Geolocalização (Mapa):** Mapa interativo nativo renderizado com `react-native-maps`, contendo 10 marcadores mockados de restaurantes na região do Centro do Rio de Janeiro.
* **Perfil de Usuário:** Tela de perfil com gestão de estado global para alternância entre Tema Claro e Tema Escuro.

## 🚀 Como executar o projeto localmente

### Pré-requisitos
* Node.js instalado no seu computador.
* Aplicativo **Expo Go** instalado no seu smartphone (disponível para Android e iOS).

### Passo a Passo

1. Faça o clone deste repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/InfnetFood.git](https://github.com/SEU_USUARIO/InfnetFood.git)
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd InfnetFood
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

5. Abra o aplicativo **Expo Go** no seu smartphone e escaneie o QR Code exibido no terminal ou no navegador.

## 🛠️ Tecnologias e Bibliotecas Utilizadas

* **React Native:** Framework principal para desenvolvimento mobile.
* **Expo:** Plataforma e ecossistema de ferramentas para React Native.
* **React Navigation:** Gerenciamento de rotas (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`).
* **React Native Maps:** Renderização do mapa nativo interativo (`react-native-maps`).
* **Expo Notifications:** Criação de notificações locais simuladas (`expo-notifications`).
* **Context API:** Gerenciamento de estado global (carrinho, usuário logado e tema claro/escuro).
* **Fetch API:** Consumo da API pública do ViaCEP.

---
*Desenvolvido como requisito de aprovação no curso de graduação.*