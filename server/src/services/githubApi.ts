import { cacheGet, cacheSet } from './cache.js';

interface GitHubData {
  followers: number;
  publicRepos: number;
  stars: number;
  topRepos: { name: string; description: string; stars: number; url: string; language: string }[];
}

export async function fetchGithubData(username: string): Promise<GitHubData> {
  const cacheKey = `github:${username}`;
  const cached = cacheGet<GitHubData>(cacheKey);
  if (cached) return cached;

  const headers: HeadersInit = { 'User-Agent': 'portfolio-app' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`, { headers }),
  ]);

  if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

  const user  = await userRes.json() as { followers: number; public_repos: number };
  const repos = await reposRes.json() as { name: string; description: string; stargazers_count: number; html_url: string; language: string; fork: boolean }[];

  const ownRepos = repos.filter(r => !r.fork);
  const stars    = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const topRepos = ownRepos.slice(0, 6).map(r => ({
    name:        r.name,
    description: r.description || '',
    stars:       r.stargazers_count,
    url:         r.html_url,
    language:    r.language || 'Unknown',
  }));

  const data: GitHubData = { followers: user.followers, publicRepos: user.public_repos, stars, topRepos };
  cacheSet(cacheKey, data);
  return data;
}
