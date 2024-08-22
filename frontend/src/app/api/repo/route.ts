import url from 'url';

import { NextResponse } from 'next/server';

async function fetchDirectoryContents(
  owner: any,
  repoName: any,
  path: any,
  token: any,
) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${apiUrl}: ${response.statusText}`);
  }

  let contents = await response.json();

  contents.sort((a: any, b: any) => {
    if (a.type === 'dir' && b.type !== 'dir') {
      return -1;
    } else if (a.type !== 'dir' && b.type === 'dir') {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  for (let i = 0; i < contents.length; i++) {
    const item = contents[i];
    if (item.type === 'dir') {
      const subContents = await fetchDirectoryContents(
        owner,
        repoName,
        item.path,
        token,
      );
      item.contents = subContents;
    }
  }

  return contents;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { owner, repoName, token } = body;

    const data = await fetchDirectoryContents(owner, repoName, '', token);

    return NextResponse.json(data || null);
  } catch (error) {
    console.log('[PROJECT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
