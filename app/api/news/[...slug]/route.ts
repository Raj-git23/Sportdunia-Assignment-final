

import { NextRequest, NextResponse } from 'next/server';

// Helper function to get friendly error messages
function getFriendlyMessage(status: number): string {
  switch (status) {
    case 400:
      return "The request was invalid. Please check your search parameters.";
    case 401:
      return "Authentication failed. Please check your API key.";
    case 403:
      return "Access forbidden. You don't have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 426:
      return "API upgrade required. This request cannot be completed with the current plan.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error occurred. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

// Server-side News API function
async function fetchNewsAPIServer({
  endpoint,
  query = {},
}: {
  endpoint: string;
  query?: any;
}) {
  // Get API key from server environment (NOT NEXT_PUBLIC_)
  const apiKey = process.env.NEWS_API_KEY; // Remove NEXT_PUBLIC_ prefix
  const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT;

  if (!apiKey) {
    return {
      error: "API key is not configured.",
      status: 500
    };
  }

  const serializeQueryParams = (query: any) => {
    const params = new URLSearchParams();
    for (const key in query) {
      if (Array.isArray(query[key])) {
        params.append(key, query[key].join(','));
      } else if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
        params.append(key, query[key]);
      }
    }
    return params.toString();
  };

  const params = serializeQueryParams(query);
  let responseStatus = 500;

  try {
    const res = await fetch(`${baseUrl}/${endpoint}?apiKey=${apiKey}&${params}`, {
      method: 'GET',
      headers: {
        // 'User-Agent': 'NewsHUB/1.0',
      },
    });

    responseStatus = res.status;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        return {
          error: data?.message || getFriendlyMessage(responseStatus),
          status: responseStatus,
          code: data?.code
        };
      }
      return { data };
    } else {
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

// API Route Handler (App Router)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const endpoint = params.slug.join('/');
    const { searchParams } = new URL(request.url);
    
    // Convert URLSearchParams to object
    const query: any = {};
    searchParams.forEach((value, key) => {
      if (key !== 'apiKey') { // Don't pass apiKey from client
        query[key] = value;
      }
    });

    const result = await fetchNewsAPIServer({
      endpoint,
      query
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}