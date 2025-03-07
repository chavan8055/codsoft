import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    answer: 'Paris'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    answer: 'Mars'
  },
  {
    question: 'Who wrote "Hamlet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    answer: 'William Shakespeare'
  }
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {quizFinished ? (
        <View>
          <Text style={styles.scoreText}>Quiz Finished! Your Score: {score}/{questions.length}</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>
          <FlatList
            data={questions[currentQuestion].options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.optionButton, selectedAnswer === item && styles.selectedOption]}
                onPress={() => handleAnswer(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  question: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  optionButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginVertical: 5, width: '100%', alignItems: 'center' },
  selectedOption: { backgroundColor: '#28a745' },
  optionText: { color: 'white', fontSize: 16 },
  scoreText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' }
});
