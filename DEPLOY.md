# Deployment Guide

## Project is Ready for Production! 

### What Was Cleaned

**Deleted Directories:**
- `contracts/` - Contract source code (already deployed)
- `scripts/` - Deployment scripts
- `test/` - Test files
- `artifacts/` - Compilation artifacts
- `cache/` - Hardhat cache
- `.openzeppelin/` - OpenZeppelin upgrade cache
- `metadata/` - Metadata files

**Deleted Files:**
- `hardhat.config.js` - Hardhat configuration
- Development documentation files

### What Was Kept

**Essential Files:**
- `test-dapp.html` - User interface
- `admin.html` - Admin panel
- `deployed-contracts.json` - Contract addresses
- `server.js` - Web server
- `package.json` - Dependencies
- `.env.example` - Environment template
- `Dockerfile` - Docker configuration
- `zeabur.json` - Zeabur deployment config

**Directories:**
- `node_modules/` - Dependencies
- `deployments/` - Deployment records

---

## Deployment Options

### Option 1: Traditional Server

```bash
# 1. Upload project to server
scp -r newdp user@yourserver:/var/www/

# 2. SSH into server
ssh user@yourserver

# 3. Install dependencies
cd /var/www/newdp
npm install --production

# 4. Start server
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start server.js --name debear-party
pm2 save
pm2 startup
```

### Option 2: Docker

```bash
# Build image
docker build -t debear-party .

# Run container
docker run -d -p 3000:3000 --name debear-party debear-party

# Or use docker-compose
docker-compose up -d
```

### Option 3: Zeabur (One-Click)

1. Push to GitHub
2. Connect GitHub to Zeabur
3. Deploy automatically (zeabur.json already configured)

### Option 4: Vercel

```bash
npm install -g vercel
vercel
```

### Option 5: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Environment Setup

1. Copy `.env.example` to `.env`
2. Configure:
```env
PORT=3000
NODE_ENV=production
```

---

## Verification Checklist

After deployment, verify:

- [ ] User interface accessible at `/test-dapp.html`
- [ ] Admin panel accessible at `/admin.html`
- [ ] Wallet connection works
- [ ] Contract interactions work
- [ ] All contract addresses correct in `deployed-contracts.json`

---

## Post-Deployment

### Testing

1. **User Interface** (`/test-dapp.html`):
   - Connect wallet
   - Check Pass balance
   - Test buying Pass
   - Test claiming rewards

2. **Admin Panel** (`/admin.html`):
   - Connect with Owner wallet (0xd8B428...)
   - Test pause/unpause functions
   - Verify all contract states

### Monitoring

Monitor these endpoints:
- Health: `http://yourserver:3000/`
- User app: `http://yourserver:3000/test-dapp.html`
- Admin: `http://yourserver:3000/admin.html`

### Backup

Important files to backup:
- `deployed-contracts.json`
- `deployments/`
- `.env` (keep secure!)

---

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Permission denied
```bash
sudo chown -R $USER:$USER /var/www/newdp
```

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` file
- Keep Owner private key secure
- Only allow Owner address to access admin panel
- Monitor contract pause events
- Regularly check deployment logs

---

## Support

For technical support, contact the development team.
