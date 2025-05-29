'use server';
import { promises as fsPromises } from 'fs';
import path from 'path';

export async function saveArticle({
  topic,
  content,
  imageUrl,
}: {
  topic: string;
  content: string[];
  imageUrl?: string;
}) {
  const folderName = topic
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[:*?"<>|]/g, '');

  const folderPath = path.join(
    process.cwd(),
    'public/generated-articles',
    folderName,
  );

  await fsPromises.mkdir(folderPath, { recursive: true });
  let localImagePath = '';
  if (imageUrl) {
    try {
      const imageExt = imageUrl.includes('.svg') ? 'svg' : 'png';
      const imageName = `article-image.${imageExt}`;
      localImagePath = imageName;
      if (imageUrl.startsWith('/placeholder.svg')) {
        const svgContent = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">${topic}</text>
        </svg>`;
        await fsPromises.writeFile(
          path.join(folderPath, imageName),
          svgContent,
        );
      } else {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fsPromises.writeFile(path.join(folderPath, imageName), buffer);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      localImagePath = '';
    }
  }
  const htmlContent = getHtmlArticleContent({
    topic,
    content,
    imageUrl: localImagePath,
  });
  const filePath = path.join(folderPath, 'index.html');
  await fsPromises.writeFile(filePath, htmlContent);
}

export async function downloadArticleZip({
  topic,
  content,
  imageUrl,
}: {
  topic: string;
  content: string[];
  imageUrl?: string;
}) {
  const htmlContent = getHtmlArticleContent({
    topic,
    content,
    imageUrl,
  });

  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  zip.file('index.html', htmlContent);

  if (imageUrl) {
    try {
      if (imageUrl.startsWith('/placeholder.svg')) {
        const svgContent = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">${topic}</text>
        </svg>`;
        zip.file('article-image.svg', svgContent);
      } else {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        zip.file('article-image.png', arrayBuffer);
      }
    } catch (error) {
      console.error('Error adding image to ZIP:', error);
    }
  }

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  const filename = `article-${Date.now()}.zip`;

  return { zipBuffer, filename };
}

const getHtmlArticleContent = ({
  topic,
  content,
  imageUrl,
}: {
  topic: string;
  content: string[];
  imageUrl: string | undefined;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    header {
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .article-image {
      display: block;
      max-width: 300px;
      height: auto;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .article-content {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    p {
      margin-bottom: 20px;
      font-size: 1.1rem;
    }
    .meta {
      font-style: italic;
      color: #7f8c8d;
      text-align: center;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <header>
    <h1>${topic}</h1>
    <div class="meta">Создано ${new Date().toLocaleDateString()}</div>
  </header>
  
  ${
    imageUrl
      ? `<img src="${imageUrl}" alt="Изображение для статьи - ${topic}" class="article-image">`
      : ''
  }
  
  <div class="article-content">
    ${content.map((paragraph) => `<p>${paragraph}</p>`).join('')}
  </div>
</body>
</html>
  `;
