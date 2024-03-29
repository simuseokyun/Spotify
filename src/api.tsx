const CLIENT_ID = '9b1aa9c5e93a407f8a2253ef5cd7b2c4';
const SECRET_ID = '8eef047b0dbb405b9a0236ba1d01a10e';

export const getToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: SECRET_ID,
        }),
    });
    const json = await response.json();

    return json;
};

export const getArtist = async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/artists/3hvinNZRzTLoREmqFiKr1b', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const json = await response.json();
    return json;
};

export const searchTrack = async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/search?q=travis&type=track', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const json = await response.json();
    return json;
};
