import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { supabase } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  isProfileComplete: boolean | null;
  refreshProfileStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoading: true,
  isProfileComplete: null,
  refreshProfileStatus: async () => {},
});

async function fetchProfileCompleted(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("profile_completed")
    .eq("id", userId)
    .single();
  return data?.profile_completed ?? false;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const userId = session?.user.id;

    if (!userId) {
      Promise.resolve().then(() => {
        if (isMounted) setIsProfileComplete(null);
      });
    } else {
      fetchProfileCompleted(userId).then((completed) => {
        if (isMounted) setIsProfileComplete(completed);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [session]);

  const refreshProfileStatus = useCallback(async () => {
    const userId = session?.user.id;
    if (!userId) return;
    const completed = await fetchProfileCompleted(userId);
    setIsProfileComplete(completed);
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, isProfileComplete, refreshProfileStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
