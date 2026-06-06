export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">College Discovery API</h1>
        <p className="text-gray-500 mb-8">Backend service — all endpoints live under <code className="bg-gray-100 px-1 rounded">/api</code></p>

        <div className="space-y-3">
          {[
            { method: 'POST', path: '/api/auth/register', desc: 'Register a new user' },
            { method: 'POST', path: '/api/auth/login', desc: 'Login and receive JWT' },
            { method: 'GET',  path: '/api/colleges', desc: 'Search & filter colleges' },
            { method: 'GET',  path: '/api/colleges/:id', desc: 'College detail with courses & cutoffs' },
            { method: 'GET',  path: '/api/colleges/meta', desc: 'Available states & types for filters' },
            { method: 'POST', path: '/api/compare', desc: 'Compare 2–3 colleges side by side' },
            { method: 'POST', path: '/api/predict', desc: 'Predict colleges from exam rank' },
            { method: 'GET',  path: '/api/saved', desc: 'List saved colleges (auth required)' },
            { method: 'POST', path: '/api/saved', desc: 'Save a college (auth required)' },
            { method: 'DELETE', path: '/api/saved/:collegeId', desc: 'Unsave a college (auth required)' },
          ].map(({ method, path, desc }) => (
            <div key={path} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
              <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                method === 'GET' ? 'bg-blue-100 text-blue-700' :
                method === 'POST' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>{method}</span>
              <div>
                <code className="text-sm font-mono text-gray-800">{path}</code>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
