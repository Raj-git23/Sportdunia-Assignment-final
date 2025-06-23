import { formatTime } from '@/helper/formatTime';
import React from 'react'

const HorizontalNewsCard = ({data} :any) => {
  return (
    <div className='flex flex-col'>
      {data?.map((news: any, index: number)=>{
        return(
            <div key={index} className='flex gap-1 hover:bg-gray-100 p-2 h-28 rounded-md hover:cursor-pointer'>
                <div className='w-1/3 h-full'>
                    <img src={news?.fields?.thumbnail || "/n.jpg"} alt={news?.sectionId} className='w-full h-full object-cover rounded-md'/>
                </div>

                <div className='flex-1 h-full flex flex-col justify-between p-1.5'>
                    <span>
                        <p className='line-clamp-2 font-semibold font-sans text-gray-800 text-sm leading-tight'>{news?.webTitle}</p>
                        <p className='line-clamp-1 text-xs text-gray-500 mt-1'>{news?.fields?.trailText}</p>
                    </span>

                    <span className='flex justify-between items-center text-xs'>
                        <p className=' truncate text-gray-500 mt-auto'>{news?.pillarName}</p>
                        <p className='text-gray-400'>{formatTime(news?.webPublicationDate)}</p>
                    </span>
                </div>
            </div>
        )
      })}
    </div>
  )
}

export default HorizontalNewsCard