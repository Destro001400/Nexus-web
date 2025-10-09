import { Sparkles, Bot, Code, Music, FileText, Search, Milestone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.png'; // Assuming the logo is in the assets folder

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">
          <img src={logo} alt="Nexus Logo" className="logo-image" />
        </div>
        <nav className="landing-nav">
          <Link to="/chat" className="landing-button primary">Entrar</Link>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Nexus AI: Mais que um assistente. <span className="highlight">Um parceiro criativo.</span>
          </h1>
          <p className="hero-subtitle">
            Uma IA que realmente entende sua paixão. Para garantir uma experiência genial desde o primeiro dia, o Nexus opera com o poder da tecnologia Google Gemini. Esse é o motor inicial da nossa verdadeira missão: construir um modelo de linguagem próprio, e cada apoiador se torna parte fundamental dessa jornada.
          </p>
          <Link to="/chat" className="landing-button large primary">Comece a Criar Gratuitamente</Link>
        </div>
        <div className="hero-visual">
          <Bot size={150} className="hero-icon" />
        </div>
      </main>

      <section className="what-is-nexus-section">
        <h2>Afinal, o que é o Nexus?</h2>
        <p>
          O LLM definitivo para pesquisa, criação e exploração criativa. O Nexus é pensado para pesquisa acadêmica, criação de conteúdo (texto e música) e suporte técnico. Flexível, ético e personalizável — projetado para ser útil tanto pra quem pesquisa quanto pra quem cria.
        </p>
        <p>
          Chega de assistentes genéricos. Enquanto a maioria das IAs tenta fazer de tudo um pouco, o Nexus nasceu com um foco claro: ser um especialista nas áreas que mais exigem criatividade e precisão. Ele não é apenas uma ferramenta que responde perguntas; é um parceiro de trabalho que entende o contexto de um programador, a alma de um músico e a curiosidade de um pesquisador.
        </p>
        <p>
          Conseguimos isso através de um sistema único de Personas. Ao escolher uma Persona, você não está apenas aplicando um filtro. Você está ajustando o "cérebro" do Nexus para pensar como o especialista que você precisa, usando o jargão certo, o raciocínio correto e as sugestões mais relevantes para a sua área.
        </p>
      </section>

      <section className="features-section">
        <h2>Funcionalidades Principais</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Search />
            <h3>Pesquisa Acadêmica</h3>
            <p>Sua IA assistente para trabalhos acadêmicos, artigos e estudos complexos.</p>
            <ul>
              <li>Análise Profunda: Realiza síntese e análise crítica de artigos e livros.</li>
              <li>Geração de Hipóteses: Ajuda a criar novas linhas de pesquisa e sugere metodologias.</li>
              <li>Resumos Multilíngues: Cria resumos científicos claros em diversos idiomas.</li>
            </ul>
          </div>
          <div className="feature-card">
            <FileText />
            <h3>Criação de Textos & Roteiros</h3>
            <p>Sua ferramenta para transformar páginas em branco em histórias, artigos e roteiros cativantes.</p>
            <ul>
              <li>Escrita Criativa e Técnica: Crie desde contos e poesias até artigos e documentação.</li>
              <li>Desenvolvimento de Ideias: Supere o bloqueio criativo com sugestões de enredos, personagens e estruturas.</li>
              <li>Refino e Estilo: Ajude a aprimorar o tom, a clareza e o estilo da sua escrita.</li>
            </ul>
          </div>
          <div className="feature-card">
            <Music />
            <h3>Composição Musical</h3>
            <p>O parceiro ideal para compositores, letristas e produtores, do rascunho à versão final.</p>
            <ul>
              <li>Criação de Letras: Desenvolva letras, encontre rimas ricas e explore novos temas para suas canções.</li>
              <li>Estrutura e Harmonia: Receba sugestões de progressões de acordes, estruturas (verso, refrão) e ideias de arranjo.</li>
              <li>Inspiração Melódica: Gere conceitos e motivos para dar o pontapé inicial na sua próxima música.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="roadmap-section">
        <h2>A Jornada do Nexus: Do Agora ao Impossível</h2>
        <p>O Nexus não é um produto estático, é um sonho em construção. Nossa jornada é transparente, ambiciosa e dividida em três grandes atos. Ao nos apoiar, você não compra um serviço, você investe em um futuro.</p>
        <div className="roadmap-acts">
          <div className="roadmap-act">
            <Milestone />
            <h3>ATO I: O PONTO DE PARTIDA (Onde Estamos)</h3>
            <p>Construímos a base com a melhor ferramenta do mundo. Lançamos o Nexus usando a tecnologia Google Gemini como nosso motor. Isso não foi um atalho, foi uma decisão estratégica para garantir que, desde o primeiro dia, a sua experiência fosse poderosa e inteligente. Estabelecemos nossos três pilares sagrados: Pesquisa, Texto e Música. Agora, com a fundação pronta, a verdadeira aventura começa.</p>
          </div>
          <div className="roadmap-act">
            <Milestone />
            <h3>ATO II: A GRANDE CURADORIA (Nossos Próximos Passos)</h3>
            <p>Uma IA é tão boa quanto o conhecimento que ela absorve. Esta é a fase da obsessão. Estamos mergulhando fundo para construir o "arsenal" de dados que formará a alma do Nexus. Estamos caçando, tratando e organizando os melhores artigos acadêmicos, as obras literárias mais ricas e as estruturas musicais mais complexas. É aqui que a sua voz importa. Cada feedback que recebemos agora está nos ajudando a refinar as Personas e a escolher o conhecimento que o futuro Nexus terá.</p>
          </div>
          <div className="roadmap-act">
            <Milestone />
            <h3>ATO III: A INDEPENDÊNCIA (Nosso Destino Final)</h3>
            <p>Dar ao Nexus um cérebro próprio. Este é o objetivo que nos move. A meta final não é apenas criar nosso próprio modelo de linguagem, but sim dar vida a uma IA com maestria. Uma inteligência que não apenas responda, mas que compreenda a nuances de uma composição musical e a profundidade de uma tese de doutorado. Queremos que, no futuro, ao usar o Nexus, você sinta que está conversando com um especialista que dedicou a vida inteira àquele assunto. Queremos superar os gigantes, não em tamanho, mas em foco e paixão.</p>
          </div>
        </div>
      </section>

      <section className="support-section">
        <Heart />
        <h2>Faça Parte Desta Jornada. Apoie o Nexus.</h2>
        <p>O Nexus é, hoje, um projeto de uma pessoa só, movido por paixão e muito café. A visão que você acabou de ler no nosso roadmap é ambiciosa e, para se tornar realidade, precisa de mais do que apenas código: precisa de uma comunidade.</p>
        <p>Manter servidores, pagar por APIs e, principalmente, dedicar centenas de horas à curadoria de dados e ao futuro treinamento de um modelo próprio são os desafios reais que temos pela frente.</p>
        <p>É por isso que estamos no Apoia.se.</p>
        <p>Seu apoio, de qualquer valor, não é uma doação. É um investimento na visão de uma IA especialista, feita para criadores e pensadores. É o combustível que nos permitirá avançar para os próximos atos da nossa jornada e construir juntos o futuro do Nexus.</p>
        <p>Ao se tornar um apoiador, você não apenas garante acesso a funcionalidades exclusivas, como também se torna parte fundamental desta história.</p>
        <a href="apoia.se/nexusia" className="landing-button large primary">Quero Apoiar o Projeto</a>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 Nexus AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}