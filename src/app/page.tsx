import { BatchArticlesGenerator } from '@/features/article-generator';
import { SingleArticleGenerator } from '@/features/article-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        AI Генератор статей
      </h1>
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Одну статью</TabsTrigger>
          <TabsTrigger value="batch">Пакет статей</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-6">
          <SingleArticleGenerator />
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <BatchArticlesGenerator />
        </TabsContent>
      </Tabs>
    </main>
  );
}
