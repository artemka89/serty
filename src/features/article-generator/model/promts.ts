export const PROMPT = {
  articlePromt:
    'Вы являетесь блогером крутого телеграмм канала. Напишите статью для блога на тему "[]" размером до 500 символов, включая пробелы. Статья должна быть в публицистическом стиле. Статья должна быть про конкретную(ая/ые) "[]". Первый абзац - заголок статьи (без **)',
  articleImagePropmpt: `Сгенерируй картинку для статьи - []`,
};

export function getArticlePrompt(keyword: string) {
  const prompt = PROMPT.articlePromt.replaceAll('[]', keyword);
  return prompt;
}

export function getImagePrompt(keyword: string) {
  const prompt = PROMPT.articleImagePropmpt.replaceAll('[]', keyword);
  return prompt;
}
