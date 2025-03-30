'use client';
// as we need connection between navbar and message card components for updating count of new messages
// we'll use context for it
// Context is a way to share state between components and doing so without passing it into a component by props
// we can alternatively use Redux package, but react has context API that we will use
import getUnreadMessageCount from '@/app/actions/getUnreadMessageCount';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const GlobalContext = createContext();

// Create Provider
// Context needs a provider and you wrap your app in this provider in order to have access to that context,
// so that every component in your app can get access to it
export function GlobalProvider({ children }) {
    // This will be sent down to every component
    // The only state that we want is the unread count - 0 by default
  const [unreadCount, setUnreadCount] = useState(0);

  // Get the session
  const { data: session } = useSession();

  // We only want this to happen if user is logged in
  // We don't want to fetch unread messages if it's guest
  useEffect(() => {
    if (session && session.user) {
        // returns a promise
      getUnreadMessageCount().then((res) => {
        if (res.count) setUnreadCount(res.count); // set the count in the state
      });
    }
  }, [getUnreadMessageCount, session]);

  // Pass setUnreadCount so that the count can be changed within all components
  // wrapping {children} => which ultimately will be our entire app and all the components
  return (
    <GlobalContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Create custom hook to access that context => pass in our global context
export function useGlobalContext() {
  return useContext(GlobalContext);
}