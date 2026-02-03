# Developer Notes

Quick reference for deploying and maintaining Baseline.

## Pre-Deployment Checklist

### 1. Update Supabase Credentials

Edit `/utils/supabase/info.tsx`:
```tsx
export const projectId = 'your-actual-project-id';
export const publicAnonKey = 'your-actual-anon-key';
```

### 2. Deploy Edge Function

```bash
# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# Set secrets
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGc...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
supabase secrets set SUPABASE_DB_URL=postgresql://...

# Deploy
supabase functions deploy make-server-a15ad91a
```

### 3. Vercel Environment Variables

Add these in Vercel project settings (all environments):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

### 4. Supabase Auth Settings

In Supabase dashboard:
- Enable Email provider (Authentication > Providers)
- For dev: Disable email confirmation (Settings > Auth)
- For production: Configure SMTP and enable confirmation

## Post-Export Cleanup

After exporting from Figma Make, delete these unused files:

```bash
# Delete entire unused UI components directory
rm -rf components/ui/

# Delete Figma Make specific files
rm -rf guidelines/
rm -f Attributions.md
```

## Testing After Deployment

1. ✅ Site loads without errors
2. ✅ Calculator works (5 times without login)
3. ✅ Signup creates account
4. ✅ Login works
5. ✅ No console errors
6. ✅ Mobile responsive
7. ✅ Modals open/close
8. ✅ Language switcher works

## Common Issues

### "Failed to fetch"
- Check edge function is deployed: `supabase functions list`
- Check CORS is enabled in server code

### "Unauthorized"
- Verify Supabase keys match in Vercel and `/utils/supabase/info.tsx`

### Build fails
- Run `npm install` locally first
- Check all required files exist
- Verify environment variables are set

### Signup not working
- Check edge function logs: `supabase functions logs make-server-a15ad91a`
- Verify secrets are set: `supabase secrets list`

## Monitoring

### View Logs

**Vercel (Frontend):**
Project > Deployments > [deployment] > Runtime Logs

**Supabase (Backend):**
```bash
supabase functions logs make-server-a15ad91a
```

## Important Files

**DO NOT MODIFY:**
- `/components/figma/ImageWithFallback.tsx` (protected)
- `/supabase/functions/server/kv_store.tsx` (protected)

**MUST UPDATE:**
- `/utils/supabase/info.tsx` (update values only, not structure)

**CONFIGURE BEFORE DEPLOY:**
- `.env` (create from `.env.example`)
- Vercel environment variables
- Supabase edge function secrets

## Future Enhancements

- [ ] Real license key validation (currently accepts any non-empty key)
- [ ] Email verification flow (backend ready, needs SMTP)
- [ ] Enhanced rate limiting
- [ ] Password reset flow
- [ ] Account deletion
- [ ] Export calculation history
- [ ] Dark mode

## Support

For issues, check:
1. Browser console for frontend errors
2. Vercel deployment logs
3. Supabase function logs
4. Supabase dashboard for auth issues

---

Last updated: February 3, 2025
