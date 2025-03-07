import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [newAlarm, setNewAlarm] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    loadAlarms();
    return () => clearInterval(interval);
  }, []);

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem('alarms');
      if (savedAlarms) setAlarms(JSON.parse(savedAlarms));
    } catch (error) {
      console.error(error);
    }
  };

  const saveAlarms = async (updatedAlarms) => {
    setAlarms(updatedAlarms);
    await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
  };

  const addAlarm = () => {
    const newAlarms = [...alarms, { time: newAlarm, enabled: true }];
    saveAlarms(newAlarms);
    setShowPicker(false);
  };

  const toggleAlarm = (index) => {
    const updatedAlarms = [...alarms];
    updatedAlarms[index].enabled = !updatedAlarms[index].enabled;
    saveAlarms(updatedAlarms);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
      <Text style={styles.date}>{currentTime.toDateString()}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>Set New Alarm</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={newAlarm}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            if (selectedTime) setNewAlarm(selectedTime);
          }}
        />
      )}

      <FlatList
        data={alarms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.alarmItem}>
            <Text style={styles.alarmText}>{new Date(item.time).toLocaleTimeString()}</Text>
            <Switch value={item.enabled} onValueChange={() => toggleAlarm(index)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
  time: { fontSize: 48, fontWeight: 'bold' },
  date: { fontSize: 20, marginBottom: 20 },
  button: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginVertical: 10 },
  buttonText: { color: 'white', fontSize: 18 },
  alarmItem: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 10, borderBottomWidth: 1 },
  alarmText: { fontSize: 18 }
});
