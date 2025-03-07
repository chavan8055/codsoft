import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (error) {
      console.error(error);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = () => {
    if (taskText.trim() === '') return;
    const newTask = { id: Date.now(), text: taskText, completed: false };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasks(newTasks);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a task"
        value={taskText}
        onChangeText={setTaskText}
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
            <View style={styles.task}>
              <Text style={[styles.taskText, item.completed && styles.completed]}>
                {item.text}
              </Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.delete}>❌</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
  task: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  taskText: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  delete: { color: 'red', fontSize: 18 }
});
