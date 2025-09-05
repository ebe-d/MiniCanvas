export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Mini Canvas</h1>
      <p className="text-lg mb-8">A simple drawing tool for your ideas.</p>
      <div className="space-x-4">
        <a href="/signin" className="bg-blue-500 text-white px-4 py-2 rounded">Sign In</a>
        <a href="/signup" className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</a>
      </div>
    </div>
  );
}
