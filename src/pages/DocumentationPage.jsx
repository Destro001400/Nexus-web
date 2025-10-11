import React from 'react';
import { Link } from 'react-router-dom';
import './DocumentationPage.css';

const DocumentationPage = () => {
  return (
    <div className="documentation-page">
      <header className="documentation-header">
        <img src="/assets/logo.png" alt="Nexus Logo" className="logo" />
        <Link to="/" className="back-to-chat-button">Voltar ao Chat</Link>
      </header>
      <main className="documentation-body">
        <div className="documentation-content">
          <h1>Documentação Oficial do Nexus AI</h1>

          <hr />

          <h2>Seção 1: Introdução à Filosofia do Nexus</h2>
          <p>Bem-vindo à documentação oficial do Nexus AI. Este documento serve como um guia completo para compreender não apenas as funcionalidades da plataforma, mas a filosofia fundamental que impulsiona seu desenvolvimento. O Nexus foi concebido para ser mais do que um assistente de linguagem genérico; ele é uma ferramenta especializada, projetada para atuar como um parceiro estratégico em domínios que exigem alta precisão e criatividade: <strong>Pesquisa Acadêmica, Criação de Textos & Roteiros e Composição Musical</strong>.</p>
          <p>Nossa missão é transcender a simples geração de texto, oferecendo uma IA que compreende o contexto, a intenção e as nuances de cada um desses pilares. Acreditamos que a especialização é a chave para a verdadeira inteligência colaborativa.</p>

          <hr />

          <h2>Seção 2: Guia de Início Rápido</h2>
          <p>Iniciar sua jornada com o Nexus é um processo intuitivo, projetado para que você acesse o poder da plataforma em segundos.</p>

          <h4><strong>2.1 Iniciando uma Nova Conversa</strong></h4>
          <p>Tudo começa na tela principal. O botão "Nova Conversa", localizado no topo da barra lateral (sidebar), limpa o contexto atual e prepara a IA para uma nova sessão de trabalho, garantindo que suas interações anteriores não influenciem as novas.</p>

          <h4><strong>2.2 O Conceito de "Personas": A Alma do Nexus</strong></h4>
          <p>As <strong>Personas</strong> são o principal diferencial do Nexus. Em vez de interagir com uma IA generalista, você seleciona um especialista. Cada Persona ajusta o "raciocínio" fundamental do modelo, seu vocabulário, estilo e base de conhecimento para atuar com maestria na área escolhida. A seleção de uma Persona não é um filtro; é uma reconfiguração estratégica da IA para a sua necessidade específica.</p>

          <h4><strong>2.3 Modelos Disponíveis: Flash vs. Pro</strong></h4>
          <p>O Nexus oferece dois níveis de modelos de linguagem para se adaptar às suas necessidades:</p>
          <ul>
            <li><strong>Nexus Flash:</strong> Ideal para tarefas rápidas, resumos e interações que exigem velocidade. É o modelo padrão, equilibrando performance e agilidade.</li>
            <li><strong>Nexus Pro:</strong> Um modelo mais avançado e robusto, projetado para tarefas que exigem maior profundidade criativa, análise complexa e geração de conteúdo de alta qualidade. O acesso ao Nexus Pro é uma das recompensas para nossos apoiadores.</li>
          </ul>

          <hr />

          <h2>Seção 3: Guia Detalhado das Personas</h2>
          <p>Aqui, exploramos em profundidade as capacidades de cada especialista. Os exemplos de prompts são projetados para inspirar e demonstrar como estruturar suas solicitações para obter os melhores resultados.</p>

          <h4><strong>[🔬] Persona: Pesquisa Acadêmica</strong></h4>
          <p><strong>Descrição:</strong> Seu assistente de pesquisa dedicado, treinado para compreender e processar informações acadêmicas complexas. Ideal para estudantes, pesquisadores e acadêmicos.</p>
          <p><strong>Capacidades:</strong></p>
          <ul>
            <li><strong>Análise Crítica e Síntese:</strong> Capacidade de resumir artigos, teses e livros, identificando argumentos centrais, metodologias e conclusões.</li>
            <li><strong>Geração de Hipóteses:</strong> Com base em um corpo de texto, pode sugerir novas linhas de pesquisa, questões em aberto e potenciais hipóteses.</li>
            <li><strong>Formatação e Citação:</strong> Auxilia na estruturação de trabalhos e pode ajudar a formatar referências em estilos como ABNT, APA, etc. (sempre com verificação humana).</li>
          </ul>
          <p><strong>Exemplo de Prompt Avançado:</strong><br />
          <code>"Analise o seguinte abstract [cole o abstract aqui]. Identifique a principal lacuna de pesquisa que os autores tentam preencher. Em seguida, sugira três possíveis direções para pesquisas futuras que poderiam se basear neste trabalho, e formule uma pergunta de pesquisa para cada uma delas."</code></p>

          <h4><strong>[✍️] Persona: Criação de Textos & Roteiros</strong></h4>
          <p><strong>Descrição:</strong> Um parceiro criativo para escritores, roteiristas e criadores de conteúdo. Projetado para superar o bloqueio criativo e refinar a arte da escrita.</p>
          <p><strong>Capacidades:</strong></p>
          <ul>
            <li><strong>Desenvolvimento de Enredo e Personagens:</strong> Ajuda a estruturar narrativas, criar arcos de personagens, diálogos e descrições de cenas.</li>
            <li><strong>Geração de Conteúdo Versátil:</strong> Produz desde textos para marketing e artigos de blog até contos, poesias e roteiros.</li>
            <li><strong>Análise de Tom e Estilo:</strong> Pode reescrever um trecho de texto em diferentes tons (formal, cômico, dramático) ou no estilo de um autor específico.</li>
          </ul>
          <p><strong>Exemplo de Prompt Avançado:</strong><br />
          <code>"Estou escrevendo um roteiro de curta-metragem de suspense. O protagonista é um bibliotecário noturno que descobre um livro que descreve sua própria morte. Escreva a cena de 2 páginas em que ele encontra o livro. Foque na construção da tensão através do silêncio, dos sons ambientes da biblioteca e das suas reações micro-expressivas. O diálogo deve ser mínimo ou inexistente."</code></p>

          <h4><strong>[🎵] Persona: Composição Musical</strong></h4>
          <p><strong>Descrição:</strong> Uma ferramenta dedicada a músicos, letristas e produtores. Compreende teoria musical, estrutura de canções e a arte da composição de letras.</p>
          <p><strong>Capacidades:</strong></p>
          <ul>
            <li><strong>Criação e Análise de Letras:</strong> Gera letras com base em temas, emoções ou estilos, além de analisar métricas, esquemas de rima e uso de figuras de linguagem.</li>
            <li><strong>Sugestão de Estrutura e Harmonia:</strong> Propõe progressões de acordes comuns em diferentes gêneros (ex: I-V-vi-IV no Pop) e ajuda a estruturar a canção (verso, pré-refrão, refrão, ponte).</li>
            <li><strong>Inspiração e Conceitos:</strong> Oferece ideias temáticas e conceituais para novas músicas, servindo como um ponto de partida para a criatividade.</li>
          </ul>
          <p><strong>Exemplo de Prompt Avançado:</strong><br />
          <code>"Quero compor uma música de Folk Acústico sobre a sensação de voltar para casa após muitos anos. A vibe é nostálgica, mas um pouco melancólica. Crie a letra para o primeiro verso e o refrão, utilizando um esquema de rima AABB e metáforas relacionadas à natureza e à passagem do tempo. Em seguida, sugira uma progressão de acordes simples em Sol Maior que se encaixe na emoção da letra."</code></p>

          <hr />

          <h2>Seção 4: O Futuro do Nexus e Como Fazer Parte</h2>
          <p>O Nexus é um projeto em constante evolução, impulsionado por uma visão de longo prazo e pelo apoio de uma comunidade engajada. Entenda como você pode se tornar uma peça fundamental em nossa jornada.</p>

          <h4><strong>4.1 A Missão: Construindo um Cérebro Próprio</strong></h4>
          <p>Conforme detalhado em nosso roadmap, o objetivo final é dar ao Nexus um modelo de linguagem próprio, treinado especificamente com dados de alta qualidade para nossos três pilares. O seu apoio através do <strong>Apoia.se</strong> é o que financia essa ambiciosa missão, permitindo a dedicação de tempo e recursos para a curadoria de dados e o custoso processo de treinamento.</p>

          <h4><strong>4.2 Níveis de Apoio e Recompensas</strong></h4>
          <p>Oferecemos diferentes formas de você se engajar e receber benefícios exclusivos em troca do seu apoio:</p>

          <p><strong>Nexus Pro (R$ 15,00/mês)</strong></p>
          <p>Este é o nível de apoio principal para os usuários que desejam extrair o máximo da plataforma. Como apoiador Pro, você recebe:</p>
          <ul>
            <li><strong>Acesso Ilimitado ao Modelo Nexus Pro:</strong> Utilize nosso modelo de linguagem mais avançado, ideal para tarefas complexas e que exigem máxima criatividade e profundidade.</li>
            <li><strong>Apoio Direto ao Desenvolvimento:</strong> Sua contribuição é diretamente revertida para os custos de manutenção e evolução do projeto.</li>
          </ul>

          <p><strong>Nexus Ultimate (R$ 50,00/mês)</strong></p>
          <p>Para os membros mais dedicados da nossa comunidade que desejam maximizar seu impacto no futuro do Nexus. O nível Ultimate inclui todos os benefícios do Pro, com adicionais significativos:</p>
          <ul>
            <li><strong>Acesso a Todos os Benefícios Pro:</strong> Desfrute do modelo Nexus Pro e todas as funcionalidades avançadas.</li>
            <li><strong>Acesso Prioritário a Novos Recursos:</strong> Seja o primeiro a testar novas Personas, funcionalidades e versões do modelo antes do lançamento público.</li>
            <li><strong>Maior Impacto na Missão:</strong> Sua contribuição acelera significativamente nosso roadmap, aproximando-nos do objetivo de um modelo de linguagem independente.</li>
          </ul>
          <p>Sua participação, em qualquer nível, é o que transforma o Nexus de um projeto em uma realidade em constante crescimento. Agradecemos por acreditar em nossa visão.</p>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;
