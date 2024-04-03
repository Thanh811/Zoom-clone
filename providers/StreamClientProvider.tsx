'use client'
import { tokenProvider } from '@/action/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
  StreamVideo,
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;


const StreamClientProvider = ({ children }: { children: ReactNode }) => {
  const [clientVideo, setClientVideo] = useState<StreamVideoClient>()
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error('Stream API key is missing');
  
    const clientVideo = new StreamVideoClient({
      apiKey: API_KEY,
      tokenProvider,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl, 
      } 
    })

    setClientVideo(clientVideo)
    
  }, [isLoaded, user])
  

  if (!clientVideo) return <Loader />;

  return (
    <StreamVideo client={clientVideo}>
      {children}
    </StreamVideo>
  );
};

export default StreamClientProvider