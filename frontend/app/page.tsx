"use client";

import ChatInterface from './components/ChatInterface';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <div className="z-10 w-full max-w-5xl items-center justify-center flex flex-col mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 text-center">
                    AI Travel Concierge
                </h1>
                <p className="text-slate-500 text-center max-w-lg">
                    あなたの理想の旅を、AIがリアルタイムにリサーチして提案します。
                </p>
            </div>

            <ChatInterface />
        </main>
    )
}
