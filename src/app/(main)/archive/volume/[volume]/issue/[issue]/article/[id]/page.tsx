export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { DbConnection } from "@/lib/Db";
import JournalArticle from "@/models/Article";
import ArticleDetailClient from "./ArticleDetailClient";

interface Props {
  params: Promise<{ volume: string; issue: string; id: string }>;
}

export default async function ArticlePage({ params }: Props) {
  // ✅ params await karna zaroori hai (Next.js 15+ async params)
  const { id } = await params;

  // ✅ Invalid Mongo ObjectId pe seedha 404 (CastError se bachne ke liye)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound();
  }

  await DbConnection();

  const article = await JournalArticle.findById(id).lean();

  if (!article) {
    return notFound();
  }

  // ✅ Mongoose document (ObjectId/Date) ko plain serializable object banao
  // warna "Only plain objects can be passed to Client Components" error aayega
  const plainArticle = JSON.parse(JSON.stringify(article));

  return <ArticleDetailClient article={plainArticle} />;
}