import React from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { usePets } from '../contexts/PetContext';
import { DollarSign, TrendingUp, AlertCircle, BarChart2, Users } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardExpenseSummary() {
  const { expenses, budgets } = useExpenses();
  const { pets } = usePets();

  // Calculate total expenses for all pets
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by pet
  const expensesByPet = expenses.reduce((acc, expense) => {
    acc[expense.petId] = (acc[expense.petId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Get monthly data for the chart
  const getMonthlyData = () => {
    const monthlyExpenses = expenses.reduce((acc, expense) => {
      const month = format(parseISO(expense.date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyExpenses)
      .map(([month, total]) => ({ month, total }))
      .slice(-6); // Last 6 months
  };

  // Check budget alerts
  const getBudgetAlerts = () => {
    const alerts: { petName: string; category: string; percentage: number }[] = [];
    
    budgets.forEach(budget => {
      const pet = pets.find(p => p.id === budget.petId);
      if (!pet) return;

      const categoryExpenses = expenses
        .filter(e => e.petId === budget.petId && e.category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);

      const percentage = (categoryExpenses / budget.amount) * 100;
      if (percentage > 90) {
        alerts.push({
          petName: pet.name,
          category: budget.category,
          percentage
        });
      }
    });

    return alerts;
  };

  const monthlyData = getMonthlyData();
  const budgetAlerts = getBudgetAlerts();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Monthly Average</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(totalExpenses / Math.max(monthlyData.length, 1)).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-medium text-gray-900">Budget Alerts</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {budgetAlerts.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-6">Monthly Expenses</h3>
        {monthlyData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar 
                  dataKey="total" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Expense Data Yet</h3>
            <p className="text-gray-500 max-w-sm">
              Start tracking your pet expenses to see monthly trends and insights here.
            </p>
          </div>
        )}
      </div>

      {budgetAlerts.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Budget Alerts</h3>
          <div className="space-y-4">
            {budgetAlerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-700">
                    {alert.petName}'s {alert.category} expenses are at {alert.percentage.toFixed(0)}% of budget
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Expenses by Pet</h3>
        {pets.length > 0 ? (
          <div className="space-y-4">
            {pets.map(pet => {
              const petExpenses = expensesByPet[pet.id] || 0;
              return (
                <div key={pet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1"}
                      alt={pet.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{pet.name}</h4>
                      <p className="text-sm text-gray-500">{pet.species}</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${petExpenses.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pets Added</h3>
            <p className="text-gray-500 max-w-sm">
              Add your pets to start tracking their individual expenses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}