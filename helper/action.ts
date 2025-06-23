
// Helper function to get friendly error messages
function getFriendlyMessage(status:number):string {
  switch (status) {
    case 400:
      return "The request was invalid. Please check your search parameters.";
    case 401:
      return "Authentication failed. Please check your API key.";
    case 403:
      return "Access forbidden. You don't have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error occurred. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

// Core fetch function for News API
export async function fetchNewsAPI({
  type,
  endpoint,
  body = {},
  query = {},
}: {
    type: "get" | "post" | "put" | "delete"
    endpoint: string
    body?: any,
    query?: any,
  }) {
  // SIMULATE DIFFERENT ERRORS HERE
  // Uncomment the lines below to simulate different errors:
  
  // Simulate a 404 error
  // throw new FetchError("We couldn't find the page or resource you're looking for.", 404, "We couldn't find the page or resource you're looking for.");

  // Simulate a 500 error
  // throw new FetchError("We encountered an issue on our end.", 500, "We encountered an issue on our end. Please try again later.");

  // Simulate a 401 error
  // throw new FetchError("You need to log in to perform this action.", 401, "You need to log in to perform this action.");

  // Simulate a 403 error
  // throw new FetchError("You don't have permission to access this resource.", 403, "You don't have permission to access this resource.");

  const options = type === "get" ? {} : { body: JSON.stringify(body) };
  
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT;


  const serializeQueryParams = (query: any) => {
    const params = new URLSearchParams();
    for (const key in query) {
      if (Array.isArray(query[key])) {
        // Convert array to comma-separated string for News API
        params.append(key, query[key].join(','));
      } else if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
        params.append(key, query[key]);
      }
    }
    return params.toString();
  };


  const params = serializeQueryParams(query);
  let responseStatus = 500; // Default to 500 for unknown errors
  
  try {
    const res = await fetch(`${baseUrl}/${endpoint}?api-key=${apiKey}&${params}`, {
      method: type.toUpperCase(),
      headers: {
        // "X-Api-Key": `${apiKey}`,
      },
      ...options,
    });

    responseStatus = res.status;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        // Return error details instead of throwing
        return { 
          error: data?.message || getFriendlyMessage(responseStatus), 
          status: responseStatus,
          code: data?.code
        };
      }
      return { data };
    } else {
      // Handle non-JSON response
      return { 
        error: "The server returned an unexpected response format.", 
        status: res.status 
      };
    }
  } catch (error: any) {
    return { 
      error: error.message || getFriendlyMessage(responseStatus), 
      status: responseStatus 
    };
  }
}
