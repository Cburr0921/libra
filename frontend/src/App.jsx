import BookSearch from './components/BookSearch'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Libra</h1>
          <p className="text-gray-600">Your Personal Book Review Manager</p>
        </div>
      </header>
      <main>
        <BookSearch />
      </main>
    </div>
  )
}

export default App
