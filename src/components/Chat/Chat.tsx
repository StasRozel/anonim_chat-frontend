import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import './Chat.css';

// Типы
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface Message {
  id: string;
  text: string;
  user: TelegramUser;
  timestamp: Date;
  type: 'text' | 'system';
}

// Хук для работы с Telegram WebApp
const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  
  // Функция для генерации случайного имени пользователя
  const generateRandomUser = () => {
    const adjectives = ['Смелый', 'Умный', 'Быстрый', 'Добрый', 'Веселый', 'Мудрый', 'Сильный', 'Ловкий', 'Храбрый', 'Честный'];
    const nouns = ['Волк', 'Лев', 'Орел', 'Дракон', 'Тигр', 'Медведь', 'Сокол', 'Пантера', 'Феникс', 'Барс'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    
    return {
      id: Date.now() + Math.floor(Math.random() * 1000), // Уникальный ID
      first_name: `${randomAdjective}${randomNoun}`,
      username: `user${randomNumber}`
    };
  };
  
  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // Устанавливаем пользователя из Telegram
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      } else {
        // Для тестирования вне Telegram - генерируем случайного пользователя
        setUser(generateRandomUser());
      }
      
      // Настраиваем тему
      tg.setHeaderColor('#2481cc');
      tg.expand();
    } else {
      // Для разработки вне Telegram - генерируем случайного пользователя
      setUser(generateRandomUser());
    }
  }, []);
  
  return { user };
};

// Компонент отдельного сообщения
const MessageComponent: React.FC<{ message: Message; currentUser: TelegramUser | null }> = ({ 
  message, 
  currentUser 
}) => {
  const isOwn = currentUser && message.user.id === currentUser.id;
  const isSystem = message.type === 'system';
  
  // Функция для генерации цвета аватара на основе ID пользователя
  const getAvatarColor = (userId: number) => {
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f97316', // orange
      '#6366f1'  // indigo
    ];
    return colors[userId % colors.length];
  };
  
  if (isSystem) {
    return (
      <div className="system-message">
        <div className="system-message-content">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`message ${isOwn ? 'own' : 'other'}`}>
      <div className="message-content">
        <div 
          className="message-avatar" 
          style={{ backgroundColor: getAvatarColor(message.user.id) }}
        >
          {message.user.first_name[0]}
        </div>
        <div className="message-bubble">
          {!isOwn && (
            <div className="message-author">
              {message.user.first_name}
            </div>
          )}
          <div className="message-text">{message.text}</div>
          <div className="message-time">
            {new Date(message.timestamp).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};// Основной компонент чата
const TelegramChatApp: React.FC = () => {
  const { user } = useTelegram();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Добро пожаловать в чат! 👋',
      user: { id: 0, first_name: 'Система' },
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const CHAT_ID = 'general-chat'; // Общий чат для всех пользователей

  // Подключение к Socket.IO
  useEffect(() => {
    if (!user) return; // Ждем пока пользователь будет сгенерирован

    const socketInstance = io(process.env.REACT_APP_API_URL || 'https://anonim-chat-frontend.onrender.com/');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      // Отправляем данные о пользователе при подключении
      socketInstance.emit('join-chat', { chatId: CHAT_ID, user });
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('new-message', (message: Message) => {
      console.log('Received new message:', message);
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('user-joined', (message: Message) => {
      console.log('User joined:', message);
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user]); // Зависимость от user

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Отправка сообщения
  const sendMessage = () => {
    if (inputText.trim() && user && socket && isConnected) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        user: user,
        timestamp: new Date(),
        type: 'text'
      };
      
      // Добавляем сообщение локально
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Отправляем сообщение через Socket.IO другим пользователям
      socket.emit('send-message', {
        chatId: CHAT_ID,
        message: newMessage
      });
    }
  };

  // Функция для генерации цвета аватара на основе ID пользователя
  const getAvatarColor = (userId: number) => {
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f97316', // orange
      '#6366f1'  // indigo
    ];
    return colors[userId % colors.length];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Заголовок чата */}
      <div className="chat-header">
        <div 
          className="chat-header-avatar"
          style={{ backgroundColor: user ? getAvatarColor(user.id) : '#3b82f6' }}
        >
          {user ? user.first_name[0] : <User size={20} />}
        </div>
        <div className="chat-header-info">
          <h1>Общий чат</h1>
          <p>
            {user ? `${user.first_name} ${isConnected ? 'в сети' : 'не подключен'}` : 'Загрузка...'}
            {isConnected && <span style={{ color: '#10b981', marginLeft: '8px' }}>●</span>}
          </p>
        </div>
      </div>

      {/* Список сообщений */}
      <div className="chat-messages">
        {messages.map((message) => (
          <MessageComponent 
            key={message.id} 
            message={message} 
            currentUser={user}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || !isConnected}
            className="chat-send-button"
            title={!isConnected ? 'Нет подключения к серверу' : 'Отправить сообщение'}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramChatApp;