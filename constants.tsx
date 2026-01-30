
import { Lesson, VocabWord } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'greetings',
    title: 'Greetings',
    hindiTitle: 'नमस्ते और अभिवादन',
    icon: '👋',
    phrases: [
      { id: 'g1', hindi: 'नमस्ते, आप कैसे हैं?', english: 'Hello, how are you?', explanation: 'जब आप किसी से पहली बार मिलें।' },
      { id: 'g2', hindi: 'मैं ठीक हूँ, धन्यवाद।', english: 'I am fine, thank you.', explanation: 'हाल-चाल बताने के लिए।' },
      { id: 'g3', hindi: 'आपका नाम क्या है?', english: 'What is your name?', explanation: 'नाम पूछने के लिए।' },
      { id: 'g4', hindi: 'आपसे मिलकर खुशी हुई।', english: 'Nice to meet you.', explanation: 'मुलाकात के अंत में।' }
    ]
  },
  {
    id: 'market',
    title: 'Market',
    hindiTitle: 'बाज़ार में बातचीत',
    icon: '🛒',
    phrases: [
      { id: 'm1', hindi: 'इसकी कीमत क्या है?', english: 'How much does this cost?', explanation: 'दाम पूछने के लिए।' },
      { id: 'm2', hindi: 'क्या आप इसे कम कर सकते हैं?', english: 'Can you lower the price?', explanation: 'मोल-भाव के लिए।' },
      { id: 'm3', hindi: 'मुझे एक किलो चीनी चाहिए।', english: 'I want one kilogram of sugar.', explanation: 'सामान मांगने के लिए।' }
    ]
  },
  {
    id: 'office',
    title: 'Office',
    hindiTitle: 'ऑफिस में बातचीत',
    icon: '💼',
    phrases: [
      { id: 'o1', hindi: 'क्या मैं अंदर आ सकता हूँ?', english: 'May I come in?', explanation: 'इजाज़त मांगने के लिए।' },
      { id: 'o2', hindi: 'मीटिंग कब शुरू होगी?', english: 'When will the meeting start?', explanation: 'समय पूछने के लिए।' },
      { id: 'o3', hindi: 'क्या आप मेरी मदद कर सकते हैं?', english: 'Can you help me?', explanation: 'मदद के लिए।' }
    ]
  }
];

export const VOCABULARY: VocabWord[] = [
  { id: 'v1', hindi: 'सपना', english: 'Dream', example: 'I have a big dream.' },
  { id: 'v2', hindi: 'कोशिश', english: 'Effort', example: 'Keep making an effort.' },
  { id: 'v3', hindi: 'सफलता', english: 'Success', example: 'Hard work leads to success.' },
  { id: 'v4', hindi: 'सीखना', english: 'Learning', example: 'Learning English is fun.' },
  { id: 'v5', hindi: 'मदद', english: 'Help', example: 'Can you help me please?' }
];
