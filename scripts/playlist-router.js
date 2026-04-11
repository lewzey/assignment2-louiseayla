// error messages need to be returned in JSON format
const jsonMessage = (msg) => ({ error: msg });

const handleArtists = (supabase, app) => {
    //returns all artists information
    app.get('/api/artists', async (req, res) => {
        const { data, error } = await supabase
            .from('artists')
            .select()
            .order('artist_name', { ascending: true })

        error
            ? res.json(jsonMessage('No Artists found!'))
            : res.json(data)
    });

    //returns a specific artists information
    app.get('/api/artists/:ref', async (req, res) => {
        const artist_ID = req.params.ref;
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .eq('artist_id', artist_ID)

        const match = data;

        error
            ? res.json(jsonMessage(`Artist: ${artist_ID} not found`))
            : match.length > 0
                ? res.json(match)
                : res.json(jsonMessage(`Artist: ${artist_ID} has no matches`));
    })
};

//rounded to nearest whole number. Had to enable aggregate functions on Supabase
//https://supabase.com/blog/postgrest-aggregate-functions#staying-safe-with-aggregate-functions 
const handleArtistAverage = (supabase, app) => {
    app.get('/api/artists/averages/:ref', async (req, res) => {
        const artist_ID = req.params.ref;
        const { data: artistData, error: artistError } = await supabase
            .from('artists')
            .select('artist_name')
            .eq('artist_id', artist_ID)


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
            .eq('artist_id', artist_ID);

        const match = data[0];
        let round = {};
        //rounding to nearest whole number
        for (let key in match) {
            round[key] = (Math.ceil(parseFloat(match[key])))
        }

        artistError || error
            ? res.json(jsonMessage((artistError || error).message))
            : !artistData
                ? res.json(jsonMessage(`Artist: ${artist_ID} not found`))
                : match
                    ? res.json({ artistData, round })
                    : res.json(jsonMessage(`Artist: ${artist_ID} has no data`))

    });
};

const handleGenres = (supabase, app) => {
    //returns all genres
    app.get('/api/genres', async (req, res) => {
        const { data, error } = await supabase
            .from('genres')
            .select('*');
        res.json(data)
    })

    //returns songs from a specific genre
    app.get('/api/songs/genre/:ref', async (req, res) => {
        const chosenGenre = req.params.ref;

        const { data, error } = await supabase
            .from('songs')
            .select('title, genre_id(genre_name)')
            .eq('genre_id', chosenGenre)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find a songs with the genre of ${chosenGenre}`))
            : res.json(data)
    })
}

const handleSongs = (supabase, app) => {
    // returns all songs
    app.get('/api/songs', async (req, res) => {
        const { data, error } = await supabase
            .from('songs')
            .select(`song_id, title, artist_id(artist_id,artist_name), genre_id(genre_id, genre_name), year,
                bpm, energy, danceability,loudness,liveness,valence,duration, acousticness, speechiness, popularity`)
            .order('title', { ascending: true })
        res.json(data)
    })

    //sorts songs based on the field
    app.get('/api/songs/sort/:order', async (req, res) => {
        const order = req.params.order;

        const orderMap = {
            id: 'song_id',
            title: 'title',
            artist: 'artist_id(artist_name)',
            genre: 'genre_id(genre_name)',
            year: 'year',
            duration: 'duration'
        };

        if (!orderMap[order]) {
            return res.json(jsonMessage(`The given field ${order} is not valid`));
        }

        const { data, error } = await supabase
            .from('songs')
            .select('song_id, title, artist_id(artist_name), genre_id(genre_name), year, duration ')
            .order(orderMap[order], { ascending: true })

        error
            ? res.json(jsonMessage(error.message))
            : res.json(data)
    })

    //looks for song that matches song ID
    app.get('/api/songs/:ref', async (req, res) => {
        const songID = req.params.ref;

        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('song_id', songID)

        error
            ? res.json(jsonMessage(`Cannot find the song ID: ${songID}`))
            : res.json(data)

    })

    //looks for songs from a specific year
    app.get('/api/songs/search/year/:substring', async (req, res) => {
        const chosenYear = req.params.substring;

        const { data, error } = await supabase
            .from('songs')
            .select('title, year')
            .eq('year', chosenYear)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find songs from the year ${chosenYear}`))
            : res.json(data)

    })

    //looks for songs within a range of years (not needed but thought it would be useful)
    app.get('/api/songs/search/year/:year1/:year2', async (req, res) => {
        const minYear = req.params.year1;
        const maxYear = req.params.year2;

        if (minYear > maxYear) {
            return (res.json(jsonMessage(`The end year of ${maxYear} is smaller than the minimum year of ${minYear}.`)))
        }

        const { data, error } = await supabase
            .from('songs')
            .select('title, year')
            .gte('year', minYear)
            .lte('year', maxYear)
            .order('year', { ascending: true })

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find songs between the years ${minYear} & ${maxYear}`))
            : res.json(data)

    })

    //looks for songs from a specific artist
    app.get('/api/songs/artist/:ref', async (req, res) => {
        const chosenArtist = req.params.ref;

        const { data, error } = await supabase
            .from('songs')
            .select('title, artist_id(artist_name)')
            .eq('artist_id', chosenArtist)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find an artist with the ID ${chosenArtist}`))
            : res.json(data)

    })
}


//found ilike from https://docs.getdbt.com/sql-reference/ilike 
//only selecting title and artist name to help identify if i'm filtering correctly
const handleSongsContain = (supabase, app) => {
    //looks for songs that contain the given substring
    app.get('/api/songs/search/any/:substring', async (req, res) => {
        const values = req.params.substring;

        const { data, error } = await supabase
            .from('songs')
            .select(`title, artist_id(artist_name)`)
            .ilike('title', `%${values}%`)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find songs containing ${values}`))
            : res.json(data)
    })

    //looks for songs that start with given substring
    app.get('/api/songs/search/begin/:substring', async (req, res) => {
        const values = req.params.substring;

        const { data, error } = await supabase
            .from('songs')
            .select(`title, artist_id(artist_name)`)
            .ilike('title', `${values}%`)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find songs starting with ${values}`))
            : res.json(data)
    })
}


const handlePlaylist = (supabase, app) => {
    //looks for playlists from that match the ref number
    app.get('/api/playlists/:ref', async (req, res) => {
        const chosenPlaylist = req.params.ref;

        const { data, error } = await supabase
            .from('playlists')
            .select('playlist_id, song_id(song_id, title, artist_id(artist_name), genre_id(genre_name), year)')
            .eq('playlist_id', chosenPlaylist)

        const match = data;

        error || match.length <= 0
            ? res.json(jsonMessage(`Cannot find playlist with the ID ${chosenPlaylist}`))
            : res.json(data)
    })

    //returns all playlists in ascending order
    app.get('/api/playlists', async (req, res) => {

        const { data, error } = await supabase
            .from('playlists')
            .select('playlist_id, song_id(song_id, title, artist_id(artist_name), genre_id(genre_name), year)')
            .order('playlist_id', { ascending: true });

        res.json(data)
    })
}

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
    handleArtists,
    handleArtistAverage,
    handleGenres,
    handleSongs,
    handleSongsContain,
    handlePlaylist,
    handleMoodDancing,
    handleMoodHappy,
    handleMoodCoffee,
    handleMoodStudying,
    handleOtherMoods
};