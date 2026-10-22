import { useState, useEffect } from 'react';
import { getConcerts } from '../api/concertApi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws';

export function useConcerts() {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        getConcerts()
            .then(data => { if (active) setConcerts(data); })
            .catch(err => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/topic/concerts', (message) => {
                    const newConcert = JSON.parse(message.body);
                    setConcerts(prev => {
                        if (prev.some(c => c.id === newConcert.id)) return prev;
                        return [newConcert, ...prev];
                    });
                });

                client.subscribe('/topic/concert-updates', (message) => {
                    const updated = JSON.parse(message.body);
                    setConcerts(prev => prev.map(c => c.id === updated.id ? updated : c));
                });
            },
        });

        client.activate();
        return () => client.deactivate();
    }, []);

    return { concerts, setConcerts, loading, error };
}