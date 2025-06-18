import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TransactionForm from './TransactionForm';

const TRANSACTIONS_STORAGE_KEY = '@BudgetApp_transactions';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
};

const DUMMY_TRANSACTIONS: Transaction[] = [
  {id: 't1', name: 'Welcome!', amount: 100.0, date: '2025-06-17'},
  {id: 't2', name: 'Your First Expense', amount: -25.0, date: '2025-06-17'},
];

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  // useEffect for loading data (no changes here)
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem(
          TRANSACTIONS_STORAGE_KEY,
        );
        if (storedTransactions !== null) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          setTransactions(DUMMY_TRANSACTIONS);
        }
      } catch (e) {
        Alert.alert('Failed to load transactions.');
      }
    };
    loadTransactions();
  }, []);

  // useEffect for saving data (no changes here)
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        const jsonValue = JSON.stringify(transactions);
        await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, jsonValue);
      } catch (e) {
        Alert.alert('Failed to save transactions.');
      }
    };
    // The initial load triggers this, so we check if the transactions array is not the initial dummy data or empty
    if (transactions.length > 0) {
      saveTransactions();
    }
  }, [transactions]);

  // Handler for adding a transaction (no changes here)
  const handleAddTransaction = (transactionData: {
    name: string;
    amount: number;
  }) => {
    const newTransaction: Transaction = {
      id: `t${new Date().getTime()}`,
      name: transactionData.name,
      amount: transactionData.amount,
      date: new Date().toISOString().slice(0, 10),
    };
    setTransactions(currentTransactions => [
      newTransaction,
      ...currentTransactions,
    ]);
    setModalIsVisible(false);
  };

  // --- NEW: Handler for DELETING a transaction ---
  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction', // Title of the alert
      'Are you sure you want to delete this transaction?', // Message
      [
        // Array of buttons
        {
          text: 'Cancel',
          style: 'cancel', // 'cancel' style is for iOS to show it separately
        },
        {
          text: 'Delete',
          onPress: () => {
            // This is the core deletion logic
            setTransactions(currentTransactions =>
              currentTransactions.filter(transaction => transaction.id !== id),
            );
          },
          style: 'destructive', // 'destructive' style gives the button a red color on iOS
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalIsVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TransactionForm
        visible={modalIsVisible}
        onClose={() => setModalIsVisible(false)}
        onAddTransaction={handleAddTransaction}
      />

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          // --- NEW: Wrap the item in a TouchableOpacity to make it tappable ---
          <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)}>
            <View style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionName}>{item.name}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  item.amount >= 0 ? styles.income : styles.expense,
                ]}>
                {item.amount >= 0 ? '+' : ''}
                P{Math.abs(item.amount).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// --- No changes to styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 28,
    lineHeight: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  income: {
    color: '#2E8B57',
  },
  expense: {
    color: '#C70039',
  },
});

export default TransactionList;