import { supabase } from './playlist-supabase.js';

// error messages need to be returned in JSON format
const jsonMessage = (msg) => ({ error: msg });

// get all artists
export const getArtists = async () => {
    const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('artist_name', { ascending: true });

    if (error) {
        return { error: 'No Artists found!' };
    }

    return data;
};

// get one artist by ID
export const getArtistById = async (artistId) => {
    const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('artist_id', artistId)
        .single();

    if (error) {
        return { error: `Artist: ${artistId} not found` };
    }

    return data;
};

// get artist averages
export const getArtistAverages = async (artistId) => {
    // get artist name
    const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('artist_name')
        .eq('artist_id', artistId)
        .single();

    // get averages
    const { data, error } = await supabase
        .from('songs')
        .select(`
      avg_bpm:bpm.avg(),
      avg_energy:energy.avg(),
      avg_danceability:danceability.avg(),
      avg_loudness:loudness.avg(),
      avg_liveness:liveness.avg(),
      avg_valence:valence.avg(),
      avg_duration:duration.avg(),
      avg_acousticness:acousticness.avg(),
      avg_speechiness:speechiness.avg(),
      avg_popularity:popularity.avg()
    `)
        .eq('artist_id', artistId);

    if (artistError || error) {
        return { error: (artistError || error).message };
    }

    const match = data[0];

    if (!match) {
        return { error: `Artist: ${artistId} has no data` };
    }

    // round values
    let round = {};
    for (let key in match) {
        round[key] = Math.ceil(parseFloat(match[key]));
    }

    return {
        artistData,
        averages: round
    };
};