import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://apnymskncplxtbfgkalx.supabase.co"
const supabaseKey = "sb_publishable_wCN5wCsLBmNbLgtErhHQ3w_mCvMdwTEY"

export const supabase = createClient(supabaseUrl, supabaseKey)