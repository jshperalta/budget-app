import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import GestureHandler from '../src/components/GestureHandler';
import TransactionList from '../src/components/TransactionList';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <TransactionList />
      <GestureHandler/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // A light grey background
  },
});

export default App;