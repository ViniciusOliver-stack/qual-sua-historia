import {
  Briefcase,
  GraduationCap,
  Heart,
  Plane,
  Star,
  Users,
} from "lucide-react";

export const predefinedQuestions = [
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
