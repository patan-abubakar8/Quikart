const SimpleLogin = () => {
  console.log('SimpleLogin component rendering');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Simple Login Test
        </h1>
        <p className="text-center text-gray-600">
          This is a simple login component to test if routing works.
        </p>
        <button 
          onClick={() => console.log('Button clicked')}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default SimpleLogin;