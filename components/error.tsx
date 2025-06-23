import React from 'react';


interface ErrorProps{
    error: string;
    handleError?: () => void;
}

const ErrorComponent = ({error, handleError}: ErrorProps) => {
  return (
    <main>
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={handleError}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}

export default ErrorComponent
