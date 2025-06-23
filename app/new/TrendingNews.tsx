import ErrorComponent from '@/components/error';
import { TrendingNewsCardSkeleton } from '@/components/loading-skeleton';
import TrendingNewsCard from '@/components/trending-card';
import { fetchNewsAPI } from '@/helper/action';
import React, { useEffect, useState } from 'react'


const TrendingNews = () => {

    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const fetchData = async () => {
        setLoading(true);
        setError(undefined);
        
        try{
           const res = await fetchNewsAPI({
                type:"get", 
                endpoint: "search", 
                query: {
                    q: "breaking news OR viral OR trending",
                    'page-size': 24,
                    'order-by': 'newest',
                    'show-fields': 'thumbnail,trailText,byline,publication,headline',
                    'show-tags': 'contributor',
                    'from-date': new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 3 days for trending content
                },
           });

           // Guardian API response structure
           if(res?.data?.response?.status === "ok" && res?.data?.response?.total > 0){
            setData(res?.data?.response?.results)
           } else {
            setData([]);
           }

        } catch(error: any){
            console.error("API Error:", error);
            setError(error?.message || "Failed to fetch trending news");
        } finally{
            setLoading(false);
        }
    } 

    useEffect(() => {
        fetchData();
    }, []);

    
    
    if(loading) return <TrendingNewsCardSkeleton />
    if(error) return <ErrorComponent error={error} handleError={fetchData} />


  return (
    <div className='space-y-2 px-2'>
      <p className='text-lg font-semibold'>Trending 🔥 </p>
      <TrendingNewsCard data={data?.[0]} />
    </div>
  )
}

export default TrendingNews