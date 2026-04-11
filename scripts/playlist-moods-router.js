// error messages need to be returned in JSON format
const jsonMessage = (msg) => ({ error: msg });

const handleMoodDancing = (supabase, app) => {
    app.get('/api/mood/dancing/:ref', async (req, res) => {
        let num = parseInt(req.params.ref);
        if (isNaN(num) || num < 1 || num > 20) {
            num = 20;
        }

        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)
            .order('danceability', { ascending: false })
            .limit(num)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage('Cannot find songs for the mood'))
            : res.json(data)
    })

    //defaults to limit of 20 even without a ref
    app.get('/api/mood/dancing', async (req, res) => {
        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)
            .order('danceability', { ascending: false })
            .limit(20);

        const match = data;

        error || !match || match.length <= 0
            ? res.json(jsonMessage('Cannot find songs for the mood'))
            : res.json(data);
    });

}

const handleMoodHappy = (supabase, app) => {
    app.get('/api/mood/happy/:ref', async (req, res) => {
        let num = parseInt(req.params.ref);
        if (isNaN(num) || num < 1 || num > 20) {
            num = 20;
        }

        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)
            .order('valence', { ascending: false })
            .limit(num)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage('Cannot find songs for the mood'))
            : res.json(data)
    })

    //defaults to limit of 20 even without a ref
    app.get('/api/mood/happy', async (req, res) => {
        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)
            .order('valence', { ascending: false })
            .limit(20);

        const match = data;

        error || !match || match.length <= 0
            ? res.json(jsonMessage('Cannot find songs for the mood'))
            : res.json(data);
    });

}

const handleMoodCoffee = (supabase, app) => {
    app.get('/api/mood/coffee/:ref', async (req, res) => {
        let num = parseInt(req.params.ref);
        if (isNaN(num) || num < 1 || num > 20) {
            num = 20;
        }

        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)

        if (error || !data) {
            return res.json(jsonMessage('Cannot find songs for the mood'));
        }

        let match = data
            .map(song => ({
                ...song,
                coffee: Math.round((song.liveness / song.acousticness) * 100) / 100 //rounds to nearest 2 decimal
            }))
            .sort((a, b) => b.coffee - a.coffee)
            .splice(0, num)

        res.json(match)
    })

    //defaults to limit of 20 even without a ref
    app.get('/api/mood/coffee', async (req, res) => {
        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)

        if (error || !data) {
            return res.json(jsonMessage('Cannot find songs for the mood'));
        }

        let match = data
            .map(song => ({
                ...song,
                coffee: Math.round((song.liveness / song.acousticness) * 100) / 100
            }))
            .sort((a, b) => b.coffee - a.coffee)
            .splice(0, 20)

        res.json(match)
    });
}

const handleMoodStudying = (supabase, app) => {
    app.get('/api/mood/studying/:ref', async (req, res) => {
        let num = parseInt(req.params.ref);
        if (isNaN(num) || num < 1 || num > 20) {
            num = 20;
        }

        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)

        if (error || !data) {
            return res.json(jsonMessage('Cannot find songs for the mood'));
        }

        //learned about spread syntax through
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#:~:text=The%20spread%20(%20...%20),rest%20parameters%20and%20rest%20property.
        const match = data
            .map(song => ({
                ...song,
                studying: Math.round(song.energy * song.speechiness * 100) / 100 //rounds to nearest 2 decimal
            }))
            .sort((a, b) => a.studying - b.studying)
            .splice(0, num)

        res.json(match)
    })

    //defaults to limit of 20 even without a ref
    app.get('/api/mood/studying', async (req, res) => {
        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)

        if (error || !data) {
            return res.json(jsonMessage('Cannot find songs for the mood'));
        }

        const match = data
            .map(song => ({
                ...song,
                studying: Math.round(song.energy * song.speechiness * 100) / 100
            }))
            .sort((a, b) => a.studying - b.studying)
            .splice(0, 20)

        res.json(match)
    })
}

const handleOtherMoods = (supabase, app) => {
    app.get('/api/mood/:type', (req, res) => {
        const validMoods = ['dancing', 'happy', 'coffee', 'studying'];

        if (!validMoods.includes(req.params.type)) {
            return res.json(
                jsonMessage(`${req.params.type} is not a mood in our system.`)
            );
        }
    });
}

module.exports = {
    handleMoodDancing,
    handleMoodHappy,
    handleMoodCoffee,
    handleMoodStudying,
    handleOtherMoods
};