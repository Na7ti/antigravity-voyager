import { useChat } from '../hooks/useChat';
import { Send, User, Bot } from 'lucide-react';

export default function ChatInterface() {
    const { messages, input, setInput, sendMessage, isLoading } = useChat();

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl border rounded-xl overflow-hidden bg-white shadow-xl">
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center shadow-md">
                <Bot className="w-8 h-8 mr-3" />
                <div>
                    <h2 className="font-bold text-lg">AI Travel Concierge</h2>
                    <p className="text-xs text-blue-100">Powered by Antigravity</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`flex max-w-[80%] ${m.role === 'user'
                                ? 'flex-row-reverse'
                                : 'flex-row'
                                }`}
                        >
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-500 ml-3' : 'bg-emerald-500 mr-3'
                                    }`}
                            >
                                {m.role === 'user' ? (
                                    <User className="w-6 h-6 text-white" />
                                ) : (
                                    <Bot className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <div
                                className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{m.content}</div>

                                {m.location && (
                                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                                        <iframe
                                            width="100%"
                                            height="200"
                                            className="border-0"
                                            loading="lazy"
                                            allowFullScreen
                                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(m.location)}`}
                                        ></iframe>
                                        {/* Note: Without API Key, embed might show error or watermarked mode. 
                                        For demo, using simple query param often works for some endpoints or requires key. 
                                        Trying standard embed without key might fail restrictedly. 
                                        Alternative: straightforward link or static map if key missing.
                                        Let's use a standard search link fallback if embed fails effectively, 
                                        BUT for 'Embed API' we need key. 
                                        Let's actually use the "maps?q=" iframe trick which sometimes works without strict key for simple search 
                                        OR just valid link.
                                        Refining to use output="embed" format usually found in share code.
                                    */}
                                        <iframe
                                            width="100%"
                                            height="200"
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(m.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                            className="border-0"
                                        ></iframe>
                                    </div>
                                )}

                                {m.ics_data && (
                                    <div className="mt-3">
                                        <a
                                            href={`data:text/calendar;charset=utf8,${encodeURIComponent(m.ics_data)}`}
                                            download={`${m.location || 'trip'}.ics`}
                                            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            カレンダーに追加 (.ics)
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 mr-3 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={sendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="どんな旅行をお探しですか？ (例: 3月に京都に2泊3日で行きたい)"
                        className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
