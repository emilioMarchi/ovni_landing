
 GET / 200 in 918ms (next.js: 662ms, application-code: 256ms)
[browser] Error de conexión WebSocket: [object Event]
    at ws.onerror (src/lib/agent/agentClient.ts:86:17)
  84 |
  85 |       this.ws.onerror = (err) => {
> 86 |         console.error('Error de conexión WebSocket:', err);
     |                 ^
  87 |         this.setConnectionState('error');
  88 |       };
  89 | (src/lib/agent/agentClient.ts:86:17)

