# Configuración WebSocket para ovni-agent y la Landing

---

## 1. Archivo `.env.local` en la Landing (`/var/www/ovni_landing/.env.local`)

```env
# URL segura del WebSocket hacia tu backend
NEXT_PUBLIC_AGENT_SERVER_URL=wss://api.ovnistudio.com.ar/ws

# Backend remoto (ovni-agent en producción)
NEXT_PUBLIC_AGENT_BACKEND=remote

# Desactivar el mock para conectar con el agente real
NEXT_PUBLIC_USE_MOCK_AGENT=false

# Puerto para no chocar con web-ia (que usa el 3000)
PORT=3001
```

*(Nota: Recordá hacer `npm run build` y `pm2 restart ecosystem.config.cjs` tras crear o editar `.env.local`).*

---

## 2. Bloque en Nginx para `api.ovnistudio.com.ar` (VPS)

En `/etc/nginx/sites-available/api.ovnistudio.com.ar` (o `ovni-agent`), dentro del bloque `server { ... }`, agregá este bloque antes de `location /`:

```nginx
    # Soporte WebSocket para el agente (/ws y /ws/agent)
    location ~* ^/ws(/.*)?$ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
```

Luego comprobá y recargá Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```
