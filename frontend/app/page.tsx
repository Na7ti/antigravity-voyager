async function getBackendMessage() {
    try {
        // Note: We use 'backend' hostname because this runs on the server (inside docker network)
        const res = await fetch('http://backend:8000/', { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return { message: "Error connecting to backend" };
    }
}

export default async function Home() {
    const data = await getBackendMessage();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold mb-4">Hello World</h1>
                    <p className="text-xl">Backend says: <span className="font-bold text-green-600">{data.message}</span></p>
                </div>
            </div>
        </main>
    )
}
