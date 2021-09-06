// import { createClient } from "@supabase/supabase-js";
// const options = {};
// const supabase = createClient(
//   "https://etktxfrhtvbiunjpptht.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDk1Njc3NSwiZXhwIjoxOTQ2NTMyNzc1fQ.tv7j_V_7dLb_27VFrBLs5fMK8c-JCh529IOtCwf2Aqg",
//   options
// );

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://etktxfrhtvbiunjpptht.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDk1Njc3NSwiZXhwIjoxOTQ2NTMyNzc1fQ.tv7j_V_7dLb_27VFrBLs5fMK8c-JCh529IOtCwf2Aqg"
);
