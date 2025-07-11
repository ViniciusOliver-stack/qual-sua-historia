"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BookOpen,
  Edit3,
  Eye,
  FileText,
  Search,
  Trash2,
  MoreHorizontal,
  Calendar,
  BookOpenText,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Book } from "@/types/book";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import Link from "next/link";

export default function DashboardComponent() {
  const { data: session } = useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const nameUser = session?.user.name;

  // Função para buscar livros
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/book");
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
      } else {
        console.error("Erro ao buscar livros");
      }
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir livro
  const deleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/book/${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      } else {
        console.error("Erro ao excluir livro");
      }
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
    }
  };

  // Filtrar livros baseado no termo de busca
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas calculadas
  const totalBooks = books.length;
  const publishedBooks = books.filter(
    (book) => book.style === "Publicado"
  ).length;
  const inProgressBooks = totalBooks - publishedBooks;
  const totalPages = books.reduce((total, book) => {
    // Estimativa: 250 palavras por página
    const words = book.content.split(/\s+/).length;
    return total + Math.ceil(words / 250);
  }, 0);

  useEffect(() => {
    if (session) {
      fetchBooks();
    }
  }, [session]);

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8">Carregando...</div>;
  }

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Olá, {nameUser?.split(" ")[0]}!{" "}
          <Image
            src="/icons/waving-hand.png"
            width={32}
            height={32}
            alt="icon waving hand"
          />
        </h2>
        <p className="text-muted-foreground">
          Bem-vinda de volta. Continue criando suas histórias incríveis.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Livros
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {totalBooks > 0 ? "Continue escrevendo!" : "Comece sua jornada"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedBooks}</div>
            <p className="text-xs text-muted-foreground">
              {publishedBooks > 0 ? "Parabéns!" : "Publique seu primeiro"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressBooks}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressBooks > 0
                ? "Continue o trabalho"
                : "Comece a escrever"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Páginas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPages}</div>
            <p className="text-xs text-muted-foreground">
              {totalPages > 0 ? "Impressionante!" : "Comece a contar"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Meus Livros</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar livros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {book.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="bg-secondary px-2 py-1 rounded-full text-xs">
                        {book.style}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {" "}
                        <Calendar size={14} /> {formatDate(book.createdAt)}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(book)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {book.content.length > 150
                    ? book.content.substring(0, 150) + "..."
                    : book.content}
                </p>
                <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                  <BookOpenText size={16} />
                  {Math.ceil(book.content.split(/\s+/).length / 250)} páginas
                  estimadas
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? "Nenhum livro encontrado" : "Nenhum livro ainda"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Tente buscar com outros termos"
              : "Comece criando seu primeiro livro"}
          </p>
          {!searchTerm && (
            <Link
              href="/novo-livro"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Criar Novo Livro
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o livro{" "}
              <span className="font-bold">{bookToDelete?.title}</span>? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookToDelete && deleteBook(bookToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
