import { supabase } from '../lib/supabaseInit'
import { Auth } from '@supabase/ui'
import ProjectList from '../components/ProjectList'

export default function Home() {
  const { user } = Auth.useUser();

  return (
    <div className="w-full h-full bg-gray-300">
      {!user ? (
        <div className="flex items-center justify-center w-full h-full p-4">
          <Auth
            supabaseClient={supabase}
            providers={["twitter", "github"]}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-full h-full p-4"
          style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
        >
          <ProjectList user={supabase.auth.user()} />
          <button
            className="w-full mt-12 btn-black"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) console.log("Error logging out:", error.message);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
