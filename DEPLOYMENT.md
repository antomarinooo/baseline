# Deployment Guide

This guide provides step-by-step instructions for deploying Baseline to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- Repository access on GitHub
- (Optional) An npm account if you need to install private packages

## Vercel Deployment Setup

### 1. Import Project to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your `antomarinooo/baseline` repository from GitHub
4. Vercel will auto-detect the framework (Vite) and configure build settings

### 2. Configure Build Settings

Vercel should automatically detect the following settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` (or `vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, configure these manually in the project settings.

### 3. Configure Environment Variables (Optional)

If your project requires private npm packages, you'll need to configure authentication:

#### For Private npm Packages

1. **Create an npm Access Token**:
   - Go to [npmjs.com](https://www.npmjs.com) and log in
   - Navigate to "Access Tokens" in your account settings
   - Click "Generate New Token" → select "Read-only" (recommended for CI/CD)
   - Copy the generated token

2. **Add Token to Vercel**:
   - In your Vercel project dashboard, go to "Settings" → "Environment Variables"
   - Add a new variable:
     - **Name**: `NPM_TOKEN`
     - **Value**: Your npm access token (paste the token you copied)
     - **Environment**: Select "Production", "Preview", and "Development" as needed
   - Click "Save"

#### For GitHub Packages (Alternative)

If your packages are hosted on GitHub Packages instead of npm:

1. **Create a GitHub Personal Access Token**:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens
   - Generate a new token with `read:packages` scope
   - Copy the token

2. **Update `.npmrc` in your repository**:
   ```text
   @your-org:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

3. **Add Token to Vercel**:
   - Variable name: `NODE_AUTH_TOKEN`
   - Value: Your GitHub personal access token

### 4. Deploy

1. After configuring environment variables (if needed), click "Deploy"
2. Vercel will:
   - Clone your repository
   - Run `npm install` (using the `.npmrc` configuration and environment variables)
   - Run `npm run build`
   - Deploy the built application

### 5. Redeploy / Trigger New Build

To trigger a new deployment:

- **Via Git**: Push changes to your connected branch (usually `main`)
- **Via Vercel Dashboard**: Go to Deployments → click "..." menu → "Redeploy"
- **Via Vercel CLI**: Run `vercel --prod` from your local repository

## Troubleshooting

### Build Fails with "Access token expired or revoked"

This error occurs when npm cannot authenticate to download scoped/private packages.

**Solution**:
1. Verify that `NPM_TOKEN` is correctly set in Vercel environment variables
2. Ensure the token has not expired (regenerate if needed)
3. Check that `.npmrc` exists in the repository root with the correct configuration
4. Trigger a new deployment

### Build Fails with "404 Not Found" for Package

This typically means:
1. The package name is incorrect or doesn't exist in the registry
2. The package is private and requires authentication (see environment variables above)

**Solution**:
1. Verify package names in `package.json` are correct
2. For Supabase, ensure you're using `@supabase/supabase-js` (the public package)
3. If using scoped packages like `@jsr/...`, ensure proper authentication is configured

### Environment Variables Not Being Used

If environment variables aren't being recognized:
1. Ensure they're added to the correct environment (Production, Preview, Development)
2. Redeploy after adding/updating environment variables
3. Check that `.npmrc` uses the correct variable name syntax: `${VARIABLE_NAME}`

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [npm Tokens Documentation](https://docs.npmjs.com/about-access-tokens)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)

## Why This Configuration is Required

The repository includes a `.npmrc` file that references `NPM_TOKEN` as an environment variable. This allows Vercel (and other CI/CD systems) to authenticate when installing packages, without storing sensitive tokens in the repository.

During a previous deployment, the build failed with errors like:
```
npm ERR! 401 Unauthorized - GET https://registry.npmjs.org/@jsr%2fsupabase__supabase-js
npm ERR! Access token expired or revoked
```

This was caused by:
1. A dependency on `@jsr/supabase__supabase-js` which appeared to be a scoped/private package
2. The package has been corrected to use the public `@supabase/supabase-js` package
3. The `.npmrc` configuration provides a safety net for any future private packages

The combination of using the correct public package and having the `.npmrc` configuration ensures builds succeed reliably.
