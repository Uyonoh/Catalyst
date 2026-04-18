const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fxzukdwevxstqiicqavc.supabase.co';
const supabaseKey = 'sb_publishable_16aFpbgSSc_8ADV1wzkrQg_5_mxE4cQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase
    .from('prompts_public')
    .select('title, target_model, tag');

  if (error) {
    console.error(error);
    return;
  }

  console.log('Prompts in DB:');
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

checkData();
