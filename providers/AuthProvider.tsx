import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContext = {
  session: Session | null;
  user: User | null;
  profile: any | null
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null); // <-- allow null as initial value

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!session?.user) {
        setProfile(null)
      return; // <-- this returns immediately when there is a user
    }
    async function fetchProfile() {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();
      setProfile(data);
    }
    fetchProfile()
  }, [session?.user]);

  console.log(profile); // Always logs `undefined` initially (and never changes)

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
