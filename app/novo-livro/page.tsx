"use client";

import type React from "react";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Save,
  ArrowLeft,
  Plus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Type,
  Heart,
  Star,
  Users,
  Briefcase,
  GraduationCap,
  Plane,
  ImageIcon,
  HelpCircle,
  Palette,
  Upload,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  FileText,
  Hash,
  FileCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

const pageStyles = [
  {
    id: "classic",
    name: "Clássico",
    preview: "bg-white border-gray-200",
    classes: "bg-white border-gray-200 text-gray-900",
  },
  {
    id: "vintage",
    name: "Vintage",
    preview: "bg-amber-50 border-amber-200",
    classes: "bg-amber-50 border-amber-200 text-amber-900",
  },
  {
    id: "notebook",
    name: "Caderno",
    preview: "bg-blue-50 border-blue-200",
    classes: "bg-blue-50 border-blue-200 text-blue-900",
  },
  {
    id: "craft",
    name: "Artesanal",
    preview: "bg-orange-50 border-orange-200",
    classes: "bg-orange-50 border-orange-200 text-orange-900",
  },
  {
    id: "elegant",
    name: "Elegante",
    preview: "bg-purple-50 border-purple-200",
    classes: "bg-purple-50 border-purple-200 text-purple-900",
  },
];

const predefinedQuestions = [
  {
    id: 1,
    category: "Infância",
    icon: Heart,
    questions: [
      "Onde você nasceu e cresceu?",
      "Como era a casa da sua infância?",
      "Qual era sua brincadeira favorita?",
      "Conte sobre seus irmãos e amigos de infância",
      "Qual foi seu primeiro animal de estimação?",
    ],
  },
  {
    id: 2,
    category: "Família",
    icon: Users,
    questions: [
      "Como seus pais se conheceram?",
      "Conte sobre seus avós",
      "Qual tradição familiar mais marcou você?",
      "Como era o Natal na sua família?",
      "Que conselhos seus pais te davam?",
    ],
  },
  {
    id: 3,
    category: "Escola",
    icon: GraduationCap,
    questions: [
      "Como era sua escola?",
      "Quem foi seu professor favorito?",
      "Qual matéria você mais gostava?",
      "Conte sobre seus amigos da escola",
      "Qual foi sua maior conquista acadêmica?",
    ],
  },
  {
    id: 4,
    category: "Trabalho",
    icon: Briefcase,
    questions: [
      "Qual foi seu primeiro emprego?",
      "Como escolheu sua profissão?",
      "Conte sobre um dia típico no trabalho",
      "Quem foram seus mentores?",
      "Qual foi sua maior realização profissional?",
    ],
  },
  {
    id: 5,
    category: "Viagens",
    icon: Plane,
    questions: [
      "Qual foi sua primeira viagem?",
      "Que lugar mais te marcou?",
      "Conte sobre uma aventura inesperada",
      "Qual cultura mais te impressionou?",
      "Onde você gostaria de voltar?",
    ],
  },
  {
    id: 6,
    category: "Momentos Especiais",
    icon: Star,
    questions: [
      "Conte sobre o dia do seu casamento",
      "Como foi quando seus filhos nasceram?",
      "Qual foi o momento mais feliz da sua vida?",
      "Que conquista te deixou mais orgulhoso?",
      "Conte sobre uma surpresa inesquecível",
    ],
  },
];

interface HistoryState {
  content: string;
  timestamp: number;
}

export default function NovoLivro() {
  const router = useRouter();
  const [bookTitle, setBookTitle] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [bookContent, setBookContent] = useState("");
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);
  const [isQuestionsDialogOpen, setIsQuestionsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [formatMenuPosition, setFormatMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [slashCommand, setSlashCommand] = useState("");

  // Sistema de histórico para undo/redo
  const [history, setHistory] = useState<HistoryState[]>([
    { content: "", timestamp: Date.now() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sistema de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<string[]>([""]);
  const [isBookView, setIsBookView] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleSave = async () => {
    if (!bookTitle.trim() || !bookContent.trim()) {
      alert("Preencha o título e o conteúdo do livro.");
      return;
    }
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: bookTitle,
          style: selectedStyle,
          content: bookContent,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao salvar livro");
      alert("Livro salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar livro");
    }
  };

  // Adicionar ao histórico
  const addToHistory = (content: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content, timestamp: Date.now() });

    // Limitar histórico a 50 entradas
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  // Desfazer (Ctrl+Z)
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousState = history[newIndex];
      setBookContent(previousState.content);

      if (editorRef.current) {
        editorRef.current.innerHTML = previousState.content;
      }
    }
  };

  // Refazer (Ctrl+Y)
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = history[newIndex];
      setBookContent(nextState.content);

      if (editorRef.current) {
        editorRef.current.innerHTML = nextState.content;
      }
    }
  };

  // Dividir conteúdo em páginas
  const splitContentIntoPages = (content: string) => {
    if (!content) return [""];

    // Simular divisão por altura de página (aproximadamente 800 palavras por página)
    const words = content.split(/\s+/);
    const wordsPerPage = 800;
    const newPages: string[] = [];

    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageWords = words.slice(i, i + wordsPerPage);
      newPages.push(pageWords.join(" "));
    }

    return newPages.length > 0 ? newPages : [""];
  };

  // Atualizar páginas quando o conteúdo mudar
  useEffect(() => {
    if (bookContent && isBookView) {
      const newPages = splitContentIntoPages(bookContent);
      setPages(newPages);

      // Ajustar página atual se necessário
      if (currentPage > newPages.length) {
        setCurrentPage(newPages.length);
      }
    }
  }, [bookContent, isBookView]);

  // Sincronizar conteúdo do editor quando alternar entre modos
  const toggleBookView = () => {
    if (!isBookView && editorRef.current) {
      // Salvando conteúdo do editor antes de alternar para o modo livro
      const currentContent = editorRef.current.innerHTML;
      setBookContent(currentContent);
    } else if (isBookView && editorRef.current) {
      // Restaurando conteúdo no editor quando voltar do modo livro
      editorRef.current.innerHTML = bookContent;
    }
    setIsBookView(!isBookView);
  };

  // Sincronizar conteúdo quando o componente monta
  useEffect(() => {
    if (editorRef.current && bookContent && !isBookView) {
      editorRef.current.innerHTML = bookContent;
    }
  }, [isBookView]);

  const addCustomQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  // --- Cursor helpers -------------------------------------------------
  // Validate that a Range belongs to the current editor
  const isRangeInsideEditor = (rng: Range | null): rng is Range => {
    if (!rng || !editorRef.current) return false;
    return (
      editorRef.current.contains(rng.startContainer) &&
      editorRef.current.contains(rng.endContainer)
    );
  };

  // Restore cursor, falling back gracefully if the stored range is stale
  const restoreSelection = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    // If we have a *valid* saved range, use it
    if (isRangeInsideEditor(savedSelection)) {
      selection.removeAllRanges();
      selection.addRange(savedSelection!);
      editorRef.current.focus();
      return;
    }

    // Fallback: place cursor at the end of the editor
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
  };

  // Salvar a posição do cursor quando o editor perde o foco
  const saveSelection = () => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }
  };

  const insertQuestionIntoEditor = (question: string) => {
    if (editorRef.current) {
      // Salvar estado atual no histórico antes da mudança
      addToHistory(bookContent);

      // Sempre use o helper robusto
      restoreSelection();

      // Criar título da pergunta em negrito
      const questionTitle = document.createElement("h3");
      questionTitle.style.cssText = `
        font-weight: bold;
        font-size: 1.2em;
        color: #1f2937;
        margin: 24px 0 12px 0;
        padding: 0;
        border-bottom: 2px solid #3b82f6;
        padding-bottom: 8px;
      `;
      questionTitle.textContent = question;

      // Criar espaço para resposta
      const answerSpace = document.createElement("div");
      answerSpace.style.cssText = `
        min-height: 100px;
        margin-bottom: 24px;
        padding: 16px;
        border-left: 4px solid #e5e7eb;
        background-color: #f9fafb;
        border-radius: 0 8px 8px 0;
      `;
      answerSpace.innerHTML = "<p>Escreva sua resposta aqui...</p>";

      // Inserir no editor
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        // Adicionar quebra de linha antes se necessário
        if (range.startContainer.textContent?.trim()) {
          const br = document.createElement("br");
          range.insertNode(br);
          range.setStartAfter(br);
        }

        range.insertNode(questionTitle);
        range.setStartAfter(questionTitle);
        range.insertNode(answerSpace);

        // Posicionar cursor dentro da área de resposta
        const answerParagraph = answerSpace.querySelector("p");
        if (answerParagraph) {
          range.setStart(answerParagraph, 0);
          range.setEnd(
            answerParagraph,
            answerParagraph.textContent?.length || 0
          );
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      // Atualizar conteúdo
      const newContent = editorRef.current.innerHTML;
      setBookContent(newContent);
      setSavedSelection(null);
    }
    setIsQuestionsDialogOpen(false);
  };

  const formatText = (command: string, value?: string) => {
    if (editorRef.current) {
      // Salvar estado atual no histórico antes da mudança
      addToHistory(bookContent);

      editorRef.current.focus();
      document.execCommand(command, false, value);
      const newContent = editorRef.current.innerHTML;
      setBookContent(newContent);
      setShowFormatMenu(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImageUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    }
  };

  const insertImageIntoEditor = () => {
    if (editorRef.current && imagePreview) {
      // Salvar estado atual no histórico antes da mudança
      addToHistory(bookContent);

      // Sempre use o helper robusto
      restoreSelection();

      const imageElement = document.createElement("div");
      imageElement.style.cssText = `
        margin: 20px 0;
        text-align: center;
        padding: 16px;
        border: 2px dashed #e5e7eb;
        border-radius: 8px;
        background-color: #f9fafb;
      `;
      imageElement.innerHTML = `
        <img src="${imagePreview}" alt="Imagem inserida" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      `;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(imageElement);
        range.setStartAfter(imageElement);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const newContent = editorRef.current.innerHTML;
      setBookContent(newContent);
      setSavedSelection(null);
    }
    setIsImageDialogOpen(false);
    setImagePreview(null);
    setImageUrl("");
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setBookContent(newContent);

      // Verificar se há um comando de barra (/)
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          const position = range.startOffset;

          // Verificar se o caractere atual ou anterior é uma barra
          if (text[position - 1] === "/") {
            setSlashCommand("");
            const rect = range.getBoundingClientRect();

            // Posicionar o menu ACIMA do cursor, como no Notion
            setSlashMenuPosition({
              top: rect.top + window.scrollY - 320, // 320px acima para dar espaço para o menu
              left: rect.left + window.scrollX,
            });
            setShowSlashMenu(true);
          } else if (text.includes("/")) {
            // Extrair o comando após a última barra
            const lastSlashIndex = text.lastIndexOf("/");
            if (position > lastSlashIndex) {
              const command = text.substring(lastSlashIndex + 1, position);
              setSlashCommand(command);

              if (command) {
                const rect = range.getBoundingClientRect();
                setSlashMenuPosition({
                  top: rect.top + window.scrollY - 320, // 320px acima
                  left: rect.left + window.scrollX,
                });
                setShowSlashMenu(true);
              } else {
                setShowSlashMenu(false);
              }
            }
          } else {
            setShowSlashMenu(false);
          }
        }
      }
    }
  };

  const handleEditorFocus = () => {
    // Limpar seleção salva quando o editor recebe foco
    setSavedSelection(null);
  };

  const handleEditorBlur = (e: React.FocusEvent) => {
    // Não esconder o menu de formatação se clicar nele
    if (
      formatMenuRef.current &&
      formatMenuRef.current.contains(e.relatedTarget as Node)
    ) {
      return;
    }

    // Não esconder o menu de slash se clicar nele
    if (
      slashMenuRef.current &&
      slashMenuRef.current.contains(e.relatedTarget as Node)
    ) {
      return;
    }

    // Salvar seleção quando o editor perde foco
    saveSelection();

    // Esconder menus após um pequeno delay para permitir cliques nos menus
    setTimeout(() => {
      setShowFormatMenu(false);
      setShowSlashMenu(false);
    }, 200);
  };

  const handleEditorKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Ctrl+Z para desfazer
    if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      undo();
      return;
    }

    // Ctrl+Y ou Ctrl+Shift+Z para refazer
    if (
      (e.ctrlKey && e.key === "y") ||
      (e.ctrlKey && e.shiftKey && e.key === "Z")
    ) {
      e.preventDefault();
      redo();
      return;
    }

    // Ctrl+Enter para quebrar linha e sair do elemento atual
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();

      // Salvar estado atual no histórico antes da mudança
      addToHistory(bookContent);

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && editorRef.current) {
        const range = selection.getRangeAt(0);

        // Encontrar o elemento pai mais próximo (parágrafo, div, etc.)
        let currentNode: Node | null = range.startContainer;
        while (currentNode && currentNode.parentNode !== editorRef.current) {
          currentNode = currentNode.parentNode;
        }

        if (currentNode) {
          // Criar um novo parágrafo
          const newParagraph = document.createElement("p");
          newParagraph.className = "notion-block";
          newParagraph.innerHTML = "<br>";

          // Inserir após o elemento atual
          if (currentNode.nextSibling) {
            editorRef.current.insertBefore(
              newParagraph,
              currentNode.nextSibling
            );
          } else {
            editorRef.current.appendChild(newParagraph);
          }

          // Mover o cursor para o novo parágrafo
          range.selectNodeContents(newParagraph);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);

          // Atualizar conteúdo
          const newContent = editorRef.current.innerHTML;
          setBookContent(newContent);
        }
      }
    }

    // Tecla Escape para fechar menus
    if (e.key === "Escape") {
      setShowFormatMenu(false);
      setShowSlashMenu(false);
    }
  };

  const handleEditorMouseUp = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && editorRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Mostrar menu de formatação acima da seleção
      setFormatMenuPosition({
        top: rect.top + window.scrollY - 40, // Posicionar acima da seleção
        left: rect.left + window.scrollX + rect.width / 2 - 100, // Centralizar
      });
      setShowFormatMenu(true);
    } else {
      setShowFormatMenu(false);
    }
  };

  const executeSlashCommand = (command: string) => {
    // Salvar estado atual no histórico antes da mudança
    addToHistory(bookContent);

    // Remover o comando de barra do texto
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const node = range.startContainer;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const position = range.startOffset;
        const lastSlashIndex = text.lastIndexOf("/");

        if (lastSlashIndex >= 0 && position > lastSlashIndex) {
          // Remover o comando
          const newText = text.substring(0, lastSlashIndex);
          node.textContent = newText;

          // Posicionar o cursor no final do texto
          range.setStart(node, newText.length);
          range.setEnd(node, newText.length);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }

    // Executar o comando
    switch (command) {
      case "texto":
        insertBlock("p", "Comece a escrever...");
        break;
      case "título":
        insertBlock("h1", "Título");
        break;
      case "subtítulo":
        insertBlock("h2", "Subtítulo");
        break;
      case "lista":
        insertBlock("ul", "<li>Item da lista</li>");
        break;
      case "numerada":
        insertBlock("ol", "<li>Item numerado</li>");
        break;
      case "citação":
        insertBlock("blockquote", "Citação");
        break;
      case "código":
        insertBlock("pre", "<code>// Código</code>");
        break;
      case "imagem":
        setIsImageDialogOpen(true);
        break;
      case "pergunta":
        setIsQuestionsDialogOpen(true);
        break;
    }

    setShowSlashMenu(false);
  };

  const insertBlock = (tag: string, content: string) => {
    if (editorRef.current) {
      restoreSelection();

      const block = document.createElement(tag);
      block.className = "notion-block";
      block.innerHTML = content;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Encontrar o elemento pai mais próximo (parágrafo, div, etc.)
        let currentNode: Node | null = range.startContainer;
        while (currentNode && currentNode.parentNode !== editorRef.current) {
          currentNode = currentNode.parentNode;
        }

        // Inserir o novo bloco
        if (currentNode) {
          range.selectNode(currentNode);
          range.deleteContents();
        }

        range.insertNode(block);

        // Posicionar o cursor dentro do novo bloco
        range.selectNodeContents(block);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const newContent = editorRef.current.innerHTML;
      setBookContent(newContent);
    }
  };

  const getStyleClasses = (styleId: string) => {
    const style = pageStyles.find((s) => s.id === styleId);
    return style?.classes || pageStyles[0].classes;
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setIsStyleDialogOpen(false);
  };

  // Comandos organizados por categoria como no Notion
  const slashCommands = {
    suggested: [
      {
        command: "texto",
        label: "Text",
        description: "Just start writing with plain text.",
        icon: Type,
      },
      {
        command: "pergunta",
        label: "Question",
        description: "Add a predefined question to your book.",
        icon: HelpCircle,
      },
    ],
    basicBlocks: [
      {
        command: "texto",
        label: "Text",
        description: "Just start writing with plain text.",
        icon: Type,
      },
      {
        command: "título",
        label: "Heading 1",
        description: "Big section heading.",
        icon: Hash,
      },
      {
        command: "subtítulo",
        label: "Heading 2",
        description: "Medium section heading.",
        icon: Hash,
      },
      {
        command: "lista",
        label: "Bulleted list",
        description: "Create a simple bulleted list.",
        icon: List,
      },
      {
        command: "numerada",
        label: "Numbered list",
        description: "Create a list with numbering.",
        icon: ListOrdered,
      },
      {
        command: "citação",
        label: "Quote",
        description: "Capture a quote.",
        icon: Quote,
      },
      {
        command: "código",
        label: "Code",
        description: "Capture a code snippet.",
        icon: FileCode,
      },
    ],
    media: [
      {
        command: "imagem",
        label: "Image",
        description: "Upload or embed with a link.",
        icon: ImageIcon,
      },
    ],
  };

  // Filtrar comandos com base na entrada
  const getFilteredCommands = () => {
    if (!slashCommand) return slashCommands;

    const filtered = {
      suggested: slashCommands.suggested.filter(
        (item) =>
          item.command.toLowerCase().includes(slashCommand.toLowerCase()) ||
          item.label.toLowerCase().includes(slashCommand.toLowerCase())
      ),
      basicBlocks: slashCommands.basicBlocks.filter(
        (item) =>
          item.command.toLowerCase().includes(slashCommand.toLowerCase()) ||
          item.label.toLowerCase().includes(slashCommand.toLowerCase())
      ),
      media: slashCommands.media.filter(
        (item) =>
          item.command.toLowerCase().includes(slashCommand.toLowerCase()) ||
          item.label.toLowerCase().includes(slashCommand.toLowerCase())
      ),
    };

    return filtered;
  };

  // Fechar menus quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        formatMenuRef.current &&
        !formatMenuRef.current.contains(e.target as Node) &&
        editorRef.current &&
        !editorRef.current.contains(e.target as Node)
      ) {
        setShowFormatMenu(false);
      }

      if (
        slashMenuRef.current &&
        !slashMenuRef.current.contains(e.target as Node) &&
        editorRef.current &&
        !editorRef.current.contains(e.target as Node)
      ) {
        setShowSlashMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navegação entre páginas
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pages.length) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-2 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Novo Livro de Memórias</h1>
                  <p className="text-sm text-muted-foreground">
                    Crie um livro único com suas histórias
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Botões de Undo/Redo */}
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="flex items-center space-x-1 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Desfazer</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="flex items-center space-x-1"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refazer</span>
              </Button>

              {/* Toggle Book View */}
              <Button
                variant="outline"
                onClick={toggleBookView}
                className="flex items-center space-x-2 bg-transparent"
              >
                <FileText className="w-4 h-4" />
                <span>{isBookView ? "Editor" : "Livro"}</span>
              </Button>

              <Button
                onClick={handleSave}
                className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Título do seu livro..."
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-96 text-lg font-medium"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent"
              onClick={() => setIsStyleDialogOpen(true)}
            >
              <Palette className="w-4 h-4" />
              <span>Estilo</span>
            </Button>
          </div>
        </div>

        {/* Style Dialog */}
        <Dialog open={isStyleDialogOpen} onOpenChange={setIsStyleDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Personalizar Estilo da Página</DialogTitle>
              <DialogDescription>
                Escolha o estilo visual para as páginas do seu livro
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {pageStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-full h-12 rounded ${style.preview} mb-2`}
                  ></div>
                  <span className="text-sm font-medium">{style.name}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Questions Dialog */}
        <Dialog
          open={isQuestionsDialogOpen}
          onOpenChange={setIsQuestionsDialogOpen}
        >
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Perguntas ao Texto</DialogTitle>
              <DialogDescription>
                Selecione uma pergunta para inserir no seu texto como título em
                negrito.
                <br />
                <span className="text-primary font-medium">
                  Dica: Clique no editor de texto antes de abrir este diálogo
                  para posicionar a pergunta corretamente.
                </span>
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="predefined" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predefined">Sugeridas</TabsTrigger>
                <TabsTrigger value="custom">Personalizadas</TabsTrigger>
              </TabsList>
              <TabsContent value="predefined" className="space-y-4 mt-4">
                {predefinedQuestions.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center space-x-2 font-medium text-sm">
                      <category.icon className="w-4 h-4" />
                      <span>{category.category}</span>
                    </div>
                    <div className="grid gap-2">
                      {category.questions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => insertQuestionIntoEditor(question)}
                          className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="custom" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Digite sua pergunta personalizada..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={addCustomQuestion}
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Pergunta
                  </Button>
                </div>
                {customQuestions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Suas Perguntas:
                    </Label>
                    {customQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => insertQuestionIntoEditor(question)}
                        className="w-full text-left p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 transition-all text-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Imagem</DialogTitle>
              <DialogDescription>
                Escolha uma imagem por URL ou faça upload de um arquivo
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">URL da Imagem</Label>
                  <Input
                    id="image-url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="upload" className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecionar Arquivo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Escolher Arquivo</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {imagePreview && (
              <div className="space-y-4">
                <Label>Preview:</Label>
                <div className="border rounded-lg p-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-auto max-h-48 object-contain rounded"
                  />
                </div>
                <Button onClick={insertImageIntoEditor} className="w-full">
                  Inserir Imagem
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Main Content - Editor ou Book View */}
        {!isBookView ? (
          /* Editor View */
          <div className="max-w-4xl mx-auto">
            <Card className="min-h-[700px]">
              <CardHeader className="border-b">
                {/* Toolbar */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("bold")}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("italic")}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("underline")}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("insertUnorderedList")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("insertOrderedList")}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("formatBlock", "blockquote")}
                  >
                    <Quote className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsImageDialogOpen(true)}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Type className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => formatText("fontSize", "7")}
                      >
                        <span className="text-lg">Título Grande</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => formatText("fontSize", "5")}
                      >
                        <span className="text-base">Título Médio</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => formatText("fontSize", "3")}
                      >
                        <span className="text-sm">Texto Normal</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsQuestionsDialogOpen(true)}
                    className="text-primary"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Pergunta</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                <div
                  className={`min-h-[600px] ${getStyleClasses(selectedStyle)}`}
                >
                  <div
                    ref={editorRef}
                    contentEditable
                    className="p-8 min-h-[600px] outline-none prose prose-lg max-w-none focus:ring-2 focus:ring-primary/20 focus:ring-inset notion-editor"
                    style={{
                      lineHeight: "1.8",
                      fontFamily: "'Georgia', serif",
                    }}
                    onInput={handleEditorInput}
                    onFocus={handleEditorFocus}
                    onBlur={handleEditorBlur}
                    onKeyDown={handleEditorKeyDown}
                    onMouseUp={handleEditorMouseUp}
                    suppressContentEditableWarning={true}
                    data-placeholder="Comece a escrever sua história aqui... Use os botões da toolbar para adicionar perguntas, imagens e músicas. Digite / para ver comandos."
                  />

                  {/* Menu de formatação flutuante */}
                  {showFormatMenu && (
                    <div
                      ref={formatMenuRef}
                      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10 flex items-center"
                      style={{
                        top: formatMenuPosition.top,
                        left: formatMenuPosition.left,
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("bold")}
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("italic")}
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("underline")}
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-5 bg-gray-200 mx-1"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("formatBlock", "h1")}
                      >
                        <span className="text-xs font-bold">H1</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("formatBlock", "h2")}
                      >
                        <span className="text-xs font-bold">H2</span>
                      </Button>
                      <div className="w-px h-5 bg-gray-200 mx-1"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("justifyLeft")}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("justifyCenter")}
                      >
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => formatText("justifyRight")}
                      >
                        <AlignRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Menu de comandos com barra (/) - Estilo Notion */}
                  {showSlashMenu && (
                    <div
                      ref={slashMenuRef}
                      className="absolute bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-700 p-0 z-50 w-80 max-h-96 overflow-y-auto notion-slash-menu"
                      style={{
                        top: slashMenuPosition.top,
                        left: slashMenuPosition.left,
                      }}
                    >
                      {/* Header com busca */}
                      <div className="p-3 border-b border-gray-700">
                        <div className="text-xs text-gray-400 mb-2">
                          {slashCommand
                            ? `Filter: ${slashCommand}`
                            : "Type to filter"}
                        </div>
                      </div>

                      {/* Comandos organizados por categoria */}
                      <div className="p-2">
                        {(() => {
                          const filteredCommands = getFilteredCommands();
                          const hasResults =
                            filteredCommands.suggested.length > 0 ||
                            filteredCommands.basicBlocks.length > 0 ||
                            filteredCommands.media.length > 0;

                          if (!hasResults) {
                            return (
                              <div className="text-sm text-gray-400 p-4 text-center">
                                No results found
                              </div>
                            );
                          }

                          return (
                            <>
                              {/* Suggested */}
                              {filteredCommands.suggested.length > 0 && (
                                <div className="mb-4">
                                  <div className="text-xs text-gray-400 mb-2 px-2 font-medium">
                                    Suggested
                                  </div>
                                  {filteredCommands.suggested.map((item) => (
                                    <button
                                      key={`suggested-${item.command}`}
                                      className="flex items-start space-x-3 w-full text-left p-2 hover:bg-gray-700 rounded-md transition-colors"
                                      onClick={() =>
                                        executeSlashCommand(item.command)
                                      }
                                    >
                                      <div className="bg-gray-700 p-1.5 rounded mt-0.5">
                                        <item.icon className="w-4 h-4 text-gray-300" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white">
                                          {item.label}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                          {item.description}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Basic blocks */}
                              {filteredCommands.basicBlocks.length > 0 && (
                                <div className="mb-4">
                                  <div className="text-xs text-gray-400 mb-2 px-2 font-medium">
                                    Basic blocks
                                  </div>
                                  {filteredCommands.basicBlocks.map((item) => (
                                    <button
                                      key={`basic-${item.command}`}
                                      className="flex items-start space-x-3 w-full text-left p-2 hover:bg-gray-700 rounded-md transition-colors"
                                      onClick={() =>
                                        executeSlashCommand(item.command)
                                      }
                                    >
                                      <div className="bg-gray-700 p-1.5 rounded mt-0.5">
                                        <item.icon className="w-4 h-4 text-gray-300" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white">
                                          {item.label}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                          {item.description}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Media */}
                              {filteredCommands.media.length > 0 && (
                                <div className="mb-2">
                                  <div className="text-xs text-gray-400 mb-2 px-2 font-medium">
                                    Media
                                  </div>
                                  {filteredCommands.media.map((item) => (
                                    <button
                                      key={`media-${item.command}`}
                                      className="flex items-start space-x-3 w-full text-left p-2 hover:bg-gray-700 rounded-md transition-colors"
                                      onClick={() =>
                                        executeSlashCommand(item.command)
                                      }
                                    >
                                      <div className="bg-gray-700 p-1.5 rounded mt-0.5">
                                        <item.icon className="w-4 h-4 text-gray-300" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white">
                                          {item.label}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                          {item.description}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t border-gray-700 bg-gray-850">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Type / on the page</span>
                          <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                            ESC
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dicas de uso */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                Dicas de uso do editor
              </h3>
              <ul className="text-blue-700 text-sm space-y-2">
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  Digite{" "}
                  <span className="bg-blue-100 px-1 rounded mx-1 font-mono">
                    /
                  </span>{" "}
                  para abrir o menu de comandos
                </li>
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  Pressione{" "}
                  <span className="bg-blue-100 px-1 rounded mx-1 font-mono">
                    Ctrl+Enter
                  </span>{" "}
                  para criar um novo bloco
                </li>
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  Use{" "}
                  <span className="bg-blue-100 px-1 rounded mx-1 font-mono">
                    Ctrl+Z
                  </span>{" "}
                  para desfazer e{" "}
                  <span className="bg-blue-100 px-1 rounded mx-1 font-mono">
                    Ctrl+Y
                  </span>{" "}
                  para refazer
                </li>
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  Selecione texto para ver opções de formatação
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Book View - Visualização em páginas */
          <div className="max-w-5xl mx-auto">
            {/* Navegação de páginas */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {pages.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= pages.length}
                  className="flex items-center space-x-2"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Ir para página:
                </span>
                <Input
                  type="number"
                  min="1"
                  max={pages.length}
                  value={currentPage}
                  onChange={(e) =>
                    goToPage(Number.parseInt(e.target.value) || 1)
                  }
                  className="w-20 h-8"
                />
              </div>
            </div>

            {/* Página do livro */}
            <div className="flex justify-center">
              <div className="book-page-container">
                <Card className={`book-page ${getStyleClasses(selectedStyle)}`}>
                  <CardContent className="p-12">
                    {/* Cabeçalho da página */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {bookTitle || "Meu Livro de Memórias"}
                      </h1>
                      <div className="w-24 h-0.5 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 mx-auto"></div>
                    </div>

                    {/* Conteúdo da página */}
                    <div
                      className="prose prose-lg max-w-none book-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          pages[currentPage - 1] ||
                          "Esta página está vazia. Volte ao editor para adicionar conteúdo.",
                      }}
                    />

                    {/* Rodapé da página */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        — {currentPage} —
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navegação inferior */}
            <div className="flex justify-center mt-6 space-x-2">
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentPage === index + 1
                      ? "bg-primary scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSS para o editor estilo Notion e visualização do livro */}
      <style jsx global>{`
        .notion-editor {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }

        .notion-editor p {
          margin-bottom: 1em;
          min-height: 1.5em;
        }

        .notion-editor h1 {
          font-size: 1.875em;
          font-weight: 600;
          margin: 1em 0 0.5em;
          padding-bottom: 0.2em;
        }

        .notion-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em;
          padding-bottom: 0.2em;
        }

        .notion-editor blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          color: #4b5563;
          font-style: italic;
        }

        .notion-editor pre {
          background: #f3f4f6;
          padding: 1em;
          border-radius: 0.375em;
          font-family: monospace;
          overflow-x: auto;
        }

        .notion-editor ul,
        .notion-editor ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        .notion-editor li {
          margin-bottom: 0.5em;
        }

        .notion-block {
          position: relative;
          padding: 3px 2px;
          margin: 2px 0;
          border-radius: 3px;
        }

        .notion-block:hover {
          background-color: rgba(55, 53, 47, 0.03);
        }

        .notion-editor [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        /* Estilos para o menu slash estilo Notion */
        .notion-slash-menu {
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .notion-slash-menu::-webkit-scrollbar {
          width: 6px;
        }

        .notion-slash-menu::-webkit-scrollbar-track {
          background: #374151;
        }

        .notion-slash-menu::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }

        .notion-slash-menu::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Estilos para visualização do livro */
        .book-page-container {
          perspective: 1000px;
        }

        .book-page {
          width: 210mm;
          min-height: 297mm;
          max-width: 100%;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transform: rotateY(-2deg);
          transition: transform 0.3s ease;
        }

        .book-page:hover {
          transform: rotateY(0deg);
        }

        .book-content {
          font-family: "Georgia", serif;
          line-height: 1.8;
          text-align: justify;
          hyphens: auto;
        }

        .book-content h1,
        .book-content h2,
        .book-content h3 {
          text-align: left;
          margin-top: 2em;
          margin-bottom: 1em;
        }

        .book-content p {
          margin-bottom: 1.2em;
          text-indent: 1.5em;
        }

        .book-content p:first-child {
          text-indent: 0;
        }

        .book-content blockquote {
          font-style: italic;
          margin: 2em 0;
          padding: 1em 2em;
          border-left: 4px solid #d1d5db;
          background: rgba(0, 0, 0, 0.02);
        }

        .book-content img {
          max-width: 100%;
          height: auto;
          margin: 2em auto;
          display: block;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @media print {
          .book-page {
            box-shadow: none;
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .book-page {
            width: 100%;
            min-height: auto;
            transform: none;
          }

          .book-page .p-12 {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
