import { socketLeaveChat } from './../store/actions/socket.actions';
import axios from "axios";
import { Message } from "../types/types";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class ChatAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  async getMessages(chatId?: string): Promise<Message[]> {
    try {
      const url = chatId
        ? `${API_BASE_URL}/chat/messages?chatId=${chatId}`
        : `${API_BASE_URL}/chat/messages`;

      const response = await this.api.get(url);

      if (response.data.length === 0) {
        return [];
      }

      return response.data.map((msg: any) => ({
        ...msg,
        timestamp: typeof msg.timestamp === 'string' ? msg.timestamp : new Date(msg.timestamp).toISOString()
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  async sendMessage(
    message: Omit<Message, "id" | "timestamp">
  ): Promise<Message | null> {
    try {
      const response = await this.api.post(`${API_BASE_URL}/chat/messages`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(message),
      });

      return {
        ...response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  async editMessage(
    messageId: string,
    newText: string
  ): Promise<Message | null> {
    try {
      const response = await this.api.put(
        `${API_BASE_URL}/chat/messages/${messageId}`,
        {
          text: newText,
        }
      );

      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
        editedAt: response.data.editedAt ? new Date(response.data.editedAt) : undefined,
      };
    } catch (error) {
      console.error("Error editing message:", error);
      return null;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const response = await this.api.delete(
        `${API_BASE_URL}/chat/messages/${messageId}`
      );

      return response.status === 200;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }
}

export const chatAPI = new ChatAPI();
