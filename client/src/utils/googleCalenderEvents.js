import axios from 'axios';
const gapi = window.gapi;

// console.log('gapi', gapi);

export const authenticate = () => {
    // let code;
    return (
        gapi.auth2
            ?.getAuthInstance()
            //     .grantOfflineAccess({ prompt: 'consent' })
            //     .then((res) => {
            //         console.log('authCode', res.code);
            //         code = res.code;
            //     })
            ?.signIn({
                scope: process.env.REACT_APP_SCOPE,
            })
            .then(function () {
                console.log('token', gapi.client.getToken());
                // var options = {
                //     headers: {
                //         'content-type': 'application/x-www-form-urlencoded',
                //     },
                //     data: {
                //         grant_type: 'authorization_code',
                //         client_id: process.env.REACT_APP_CLIENT_ID,
                //         client_secret:
                //             process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
                //         code: code,
                //     },
                // };

                // axios
                //     .post(
                //         `http//${process.env.REACT_APP_ORIGIN}/oauth/token`,
                //         options
                //     )
                //     .then(function (response) {
                //         console.log(response);
                //         return response.data;
                //     })
                //     .catch(function (error) {
                //         console.error(error);
                //     });

                console.log('Sign-in successful');
            })
            .catch((err) => {
                console.error('Error signing in', err);
            })
    );
};
export const loadClient = () => {
    gapi.client.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
    return gapi.client
        .load(`${process.env.REACT_APP_DISCOVERY_DOCS}`)
        .then(function () {
            console.log('GAPI client loaded');
        })
        .catch((err) => {
            console.error('Error loading GAPI client for API', err);
        });
};
// Make sure the client is loaded and sign-in is complete before calling this method.
export const listAll = () => {
    return gapi.client.calendar.events
        .list({
            calendarId: process.env.REACT_APP_CALENDAR_ID,
            showDeleted: false,
            singleEvents: true,
            // maxResults: 10,
            orderBy: 'startTime',
        })
        .then((response) => {
            // Handle the results here (response.result has the parsed body).
            // console.log('Response', response);
            const { items } = response?.result;
            const events = items.map((item) =>
                // console.log('item', item),
                ({
                    title: item.summary,
                    startDate: Date.parse(item?.start?.dateTime),
                    endDate: Date.parse(item?.end?.dateTime),
                    id: item.id,
                    location: item.location,
                    notes: item.notes,
                })
            );
            // console.log('events ', events);
            return events;
        })
        .catch((err) => {
            console.error('Execute error', err);
        });
};

export const updateEvent = (event) => {
    console.log('Update object ', event);

    return gapi.client.calendar.events
        .update({
            calendarId: process.env.REACT_APP_CALENDAR_ID,
            eventId: event.id,
            resource: {
                end: {
                    dateTime: new Date(event.endDate).toISOString(),
                },
                start: {
                    dateTime: new Date(event.startDate).toISOString(),
                },
                location: event.location,
                summary: event.title,
                notes: event.notes,
            },
        })
        .then((response) => {
            // console.log('Response', response);
        })
        .catch((err) => {
            console.error('Execute error', err);
        });
};

export const addNewEvent = (event) => {
    console.log('addEvent', event);

    return gapi.client.calendar.events
        .insert({
            calendarId: process.env.REACT_APP_CALENDAR_ID,
            resource: {
                end: {
                    dateTime: new Date(event.endDate).toISOString(),
                },
                start: {
                    dateTime: new Date(event.startDate).toISOString(),
                },
                location: event.location,
                summary: event.title,
                notes: event.notes,
            },
        })
        .then((response) => {
            // Handle the results here (response.result has the parsed body).
            // console.log('Response', response);
            return response;
        })
        .catch((err) => console.error('Execute error', err));
};

export const deleteEvent = (eventId) => {
    return gapi.client.calendar.events
        .delete({
            calendarId: process.env.REACT_APP_CALENDAR_ID,
            eventId: eventId,
            sendNotifications: true,
            sendUpdates: 'all',
        })
        .then((response) => {
            // Handle the results here (response.result has the parsed body).
            // console.log('Response', response);
        })
        .catch((err) => {
            console.error('Execute error', err);
        });
};

gapi.load('client:auth2', function () {
    gapi.auth2.init({
        // apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: process.env.REACT_APP_SCOPE,
        redirect_uri: process.env.REACT_APP_ORIGIN,
        response_type: 'code',
        grant_type: 'authorization_code',
        access_type: 'offline',
        // ux_mode: 'redirect',
        // immediate: true,
        // cookiepolicy: 'single_host_origin',
    });
});
