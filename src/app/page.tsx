import { ArticleGeneratorSection } from '@/features/article-generator';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        AI Генератор статей
      </h1>
      <ArticleGeneratorSection />
    </main>
  );
}
