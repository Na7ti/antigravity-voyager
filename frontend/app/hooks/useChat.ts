import { useState } from 'react';

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    location?: string;
    ics_data?: string;
};

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'こんにちは！AIトラベルコンシェルジュです。旅行の計画をお手伝いします。どこに行きたいですか？',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: Date.now().toString(), // Use timestamp for unique ID
                role: 'assistant',
                content: data.content,
                location: data.location,
                ics_data: data.ics_data,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'すみません、エラーが発生しました。もう一度試してください。',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
    };
}
