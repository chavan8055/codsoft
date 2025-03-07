import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [attendance, setAttendance] = useState([]);
  
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const savedUsers = await AsyncStorage.getItem('users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  };

  const handleRegister = async () => {
    const newUser = { username, password, role };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    Alert.alert('Registration Successful');
  };

  const handleLogin = () => {
    const existingUser = users.find(u => u.username === username && u.password === password);
    if (existingUser) {
      setUser(existingUser);
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  const markAttendance = (course) => {
    const updatedAttendance = [...attendance, { user: user.username, course, date: new Date().toLocaleDateString() }];
    setAttendance(updatedAttendance);
  };

  return (
    <View style={styles.container}>
      {!user ? (
        <View>
          <TextInput placeholder="Username" style={styles.input} onChangeText={setUsername} />
          <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Welcome, {user.username} ({user.role})</Text>
          {user.role === 'student' ? (
            <FlatList
              data={["Math", "Science", "History"]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.button} onPress={() => markAttendance(item)}>
                  <Text style={styles.buttonText}>Mark Attendance for {item}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text>Instructor Panel - Manage Courses</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginVertical: 5 },
  buttonText: { color: 'white', textAlign: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});
