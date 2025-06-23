// pushAll.js
import { supabase } from '../supabaseClient'

async function pushAll(data, type) {
  let table = '';

  if (type === 'comida') {
    table = 'comidas';
  } else if (type === 'video') {
    table = 'videos';
  } else if (type === 'mein') {
    table = 'mein';
  } else {
    console.error('Tipo no válido');
    return null;
  }

  const { data: insertedData, error } = await supabase
    .from(table)
    .insert([data])
    .select(); // Esto hace que Supabase te devuelva los datos insertados

  if (error) {
    console.error('Error al insertar:', error);
    return null;
  }

  return insertedData[0]; // Retorna solo el objeto insertado
}

export default pushAll;
