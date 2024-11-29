import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface Expense {
  id: string;
  petId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  petId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  loading: boolean;
  addExpense: (petId: string, expense: Omit<Expense, 'id' | 'petId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addBudget: (petId: string, budget: Omit<Budget, 'id' | 'petId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getExpensesForPet: (petId: string) => Expense[];
  getBudgetsForPet: (petId: string) => Budget[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const EXPENSE_CATEGORIES = [
  'Food',
  'Medical',
  'Grooming',
  'Supplies',
  'Training',
  'Insurance',
  'Boarding',
  'Toys',
  'Other'
];

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      setBudgets([]);
      setLoading(false);
      return;
    }

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', currentUser.uid)
    );

    const budgetsQuery = query(
      collection(db, 'budgets'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData: Expense[] = [];
      snapshot.forEach((doc) => {
        expensesData.push({ id: doc.id, ...doc.data() } as Expense);
      });
      setExpenses(expensesData.sort((a, b) => b.date.localeCompare(a.date)));
    });

    const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
      const budgetsData: Budget[] = [];
      snapshot.forEach((doc) => {
        budgetsData.push({ id: doc.id, ...doc.data() } as Budget);
      });
      setBudgets(budgetsData);
      setLoading(false);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBudgets();
    };
  }, [currentUser]);

  const addExpense = async (
    petId: string,
    expenseData: Omit<Expense, 'id' | 'petId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const expenseId = uuidv4();
    const timestamp = new Date().toISOString();

    const newExpense: Expense & { userId: string } = {
      ...expenseData,
      id: expenseId,
      petId,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const expenseRef = doc(db, 'expenses', expenseId);
    await setDoc(expenseRef, newExpense);
  };

  const deleteExpense = async (id: string) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'expenses', id));
  };

  const addBudget = async (
    petId: string,
    budgetData: Omit<Budget, 'id' | 'petId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    const budgetId = uuidv4();
    const timestamp = new Date().toISOString();

    const newBudget: Budget & { userId: string } = {
      ...budgetData,
      id: budgetId,
      petId,
      userId: currentUser.uid,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const budgetRef = doc(db, 'budgets', budgetId);
    await setDoc(budgetRef, newBudget);
  };

  const deleteBudget = async (id: string) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'budgets', id));
  };

  const getExpensesForPet = (petId: string) => {
    return expenses.filter(expense => expense.petId === petId);
  };

  const getBudgetsForPet = (petId: string) => {
    return budgets.filter(budget => budget.petId === petId);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      budgets,
      loading,
      addExpense,
      deleteExpense,
      addBudget,
      deleteBudget,
      getExpensesForPet,
      getBudgetsForPet
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}