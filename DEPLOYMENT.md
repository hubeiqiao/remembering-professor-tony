# Deployment

This site is set up as a Cloudflare Worker with static assets served from `site/`.

The intended deployment path is Cloudflare Workers Builds connected to the GitHub repository, not repeated manual `wrangler deploy` runs.

## One-Time Cloudflare Setup

1. In Cloudflare, open `Workers & Pages` and select `remembering-professor-tony`.
2. Open `Settings` -> `Builds`.
3. Select `Connect`.
4. Choose the GitHub repository `hubeiqiao/remembering-professor-tony`.
5. Use `main` as the production branch.
6. Use `/` as the root directory.
7. Leave the build command empty.
8. Set the deploy command to `npm run deploy`.
9. If you want preview versions for pull requests and non-production branches, enable non-production branch builds and set the non-production deploy command to `npm run deploy:preview`.

## Repo Settings That Support This

- `wrangler.toml` keeps the Worker name aligned with Cloudflare as `remembering-professor-tony`.
- `package.json` pins `wrangler` and exposes `npm run deploy`, `npm run deploy:preview`, and `npm test`.
- The custom domain `tony.hubeiqiao.com` remains attached to the existing Worker.

## After Connection

Once the Git connection is enabled in Cloudflare, pushes to `main` deploy automatically. Preview branches can also publish automatically if non-production branch builds are enabled.
