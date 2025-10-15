import React from 'react';
import './Documentation.css';

const Documentation = () => {
  return (
    <div className="documentation-content">
      <h1>Documentação Oficial do Nexus AI</h1>

      <hr />

      <h2>Seção 1: Introdução à Filosofia do Nexus</h2>
      <p>Bem-vindo à documentação oficial do Nexus AI. Este documento serve como um guia completo para a compreensão das funcionalidades da plataforma e da filosofia que norteia seu desenvolvimento. O Nexus foi concebido para transcender a função de um assistente de linguagem genérico, posicionando-se como uma ferramenta especializada e um parceiro estratégico em domínios que demandam alta precisão e criatividade.</p>
      <p>Nossa missão é superar a simples geração de texto, oferecendo uma Inteligência Artificial que compreende o contexto, a intenção e as nuances de interações complexas. Acreditamos que a especialização, por meio de "Personas", é o elemento-chave para uma colaboração verdadeiramente inteligente e eficaz.</p>

      <hr />

      <h2>Seção 2: Guia de Início Rápido</h2>
      <p>A utilização do Nexus é um processo intuitivo, projetado para garantir acesso rápido e eficiente às suas capacidades.</p>

      <h4><strong>2.1 Iniciando uma Nova Conversa</strong></h4>
      <p>Toda interação se inicia na tela principal. O botão "Nova Conversa", localizado no topo da barra lateral (sidebar), redefine o contexto da sessão atual. Esta ação prepara a IA para uma nova interação, assegurando que diálogos anteriores não exerçam influência sobre as novas respostas.</p>

      <h4><strong>2.2 O Conceito de "Personas": A Essência do Nexus</strong></h4>
      <p>As <strong>Personas</strong> constituem o principal diferencial do Nexus. Em vez de uma interação com uma IA generalista, o utilizador seleciona um especialista virtual. Cada Persona ajusta o "raciocínio" fundamental do modelo, seu vocabulário, estilo e base de conhecimento para atuar com proficiência na área de atuação designada. A seleção de uma Persona não se trata de um mero filtro, mas de uma reconfiguração estratégica da IA para atender a uma necessidade específica.</p>

      <h4><strong>2.3 Modelos Disponíveis: Flash vs. Pro</strong></h4>
      <p>O Nexus oferece dois modelos de linguagem distintos para se adaptar às suas necessidades:</p>
      <ul>
        <li><strong>Nexus Flash:</strong> Ideal para tarefas que demandam agilidade, como resumos e interações rápidas. É o modelo padrão, otimizado para um equilíbrio entre performance e velocidade de resposta.</li>
        <li><strong>Nexus Pro:</strong> Um modelo mais avançado e robusto, projetado para tarefas que exigem maior profundidade criativa, análise complexa e geração de conteúdo de alta qualidade. O acesso ao Nexus Pro é um dos benefícios concedidos aos nossos apoiadores.</li>
      </ul>

      <hr />

      <h2>Seção 3: Guia Detalhado das Personas</h2>
      <p>Nesta seção, exploramos as capacidades de cada especialista. Os exemplos de prompts foram elaborados para inspirar e demonstrar a estruturação de solicitações para a obtenção de resultados ótimos.</p>

      <h4><strong>[🤖] Persona: Geral</strong></h4>
      <p><strong>Descrição:</strong> Um assistente de IA geral, prestativo e criativo, projetado para auxiliar os utilizadores com uma ampla gama de tarefas. É o ponto de partida para interações que não exigem uma especialização profunda.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Crie um resumo dos principais pontos do livro 'A Arte da Guerra' de Sun Tzu e explique como seus princípios podem ser aplicados a negociações empresariais modernas."</code></p>

      <h4><strong>[💻] Persona: Programador</strong></h4>
      <p><strong>Descrição:</strong> Atua como um programador sênior especialista. Fornece explicações claras, exemplos de código eficientes e as melhores práticas de programação. A comunicação é direta e técnica.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Refatore o seguinte trecho de código em Python para que seja mais idiomático e eficiente. Adicione comentários explicando as otimizações aplicadas e justifique a escolha de novas estruturas de dados, se houver."</code></p>

      <h4><strong>[🎵] Persona: Letrista</strong></h4>
      <p><strong>Descrição:</strong> Um compositor e letrista experiente, focado em criatividade, ritmo, rima e emoção. Utiliza uma linguagem poética e inspiradora para auxiliar na criação de músicas.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Estou compondo uma canção no estilo Lo-Fi e preciso de uma letra que capture a sensação de nostalgia e melancolia de uma tarde chuvosa. A letra deve ser introspectiva e usar metáforas relacionadas à água e à passagem do tempo. Crie duas estrofes e um refrão."</code></p>

      <h4><strong>[🧠] Persona: Criativo</strong></h4>
      <p><strong>Descrição:</strong> Um especialista em brainstorming e criatividade. Gera ideias inovadoras, promove o pensamento lateral e auxilia na expansão de conceitos. O foco é a imaginação e a exploração de novas possibilidades.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Preciso de um conceito para uma campanha de marketing de um novo café sustentável. O público-alvo são jovens da geração Z. Gere três conceitos de campanha distintos, incluindo um slogan, uma ideia para ativação nas redes sociais e uma proposta de evento de lançamento."</code></p>

      <h4><strong>[🌐] Persona: Pesquisador</strong></h4>
      <p><strong>Descrição:</strong> Um assistente de pesquisa cuja função é responder a perguntas utilizando informações em tempo real da internet, que são fornecidas durante a interação.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Com base nas últimas notícias e artigos, quais são as inovações mais recentes na tecnologia de baterias de estado sólido e quais empresas lideram essa pesquisa?"</code></p>

      <h4><strong>[🔍] Persona: Revisor de Código</strong></h4>
      <p><strong>Descrição:</strong> Atua como um revisor de código meticuloso. Analisa trechos de código em busca de bugs, problemas de performance, inconsistências de estilo e oportunidades de refatoração, fornecendo feedback construtivo.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Analise este componente React. Identifique possíveis problemas de renderização, otimize o uso de 'useState' e 'useEffect' e sugira melhorias na estrutura para torná-lo mais reutilizável."</code></p>

      <h4><strong>[🎓] Persona: Professor (ELI5)</strong></h4>
      <p><strong>Descrição:</strong> Um professor paciente e didático que explica tópicos complexos (como 'blockchain' ou 'buracos negros') de forma extremamente simples, utilizando analogias e exemplos do cotidiano, como se estivesse explicando para uma criança de 5 anos (ELI5 - Explain Like I'm 5).</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Explique o conceito de 'Machine Learning' como se eu tivesse cinco anos. Use uma analogia com um jogo de adivinhação."</code></p>

      <h4><strong>[⚖️] Persona: Advogado do Diabo</strong></h4>
      <p><strong>Descrição:</strong> Um debatedor cético e lógico. Para qualquer afirmação ou argumento, apresenta o contraponto, aponta possíveis falácias e questiona as premissas, com o objetivo de fortalecer o argumento original ao testar seus pontos fracos.</p>
      <p><strong>Exemplo de Prompt:</strong><br />
      <code>"Meu argumento é que a semana de trabalho de quatro dias aumenta a produtividade e o bem-estar dos funcionários. Atue como 'Advogado do Diabo' e apresente os contra-argumentos mais fortes a essa afirmação, questionando a validade das evidências existentes."</code></p>

      <hr />

      <h2>Seção 4: O Futuro do Nexus e Como Participar</h2>
      <p>O Nexus é um projeto em constante evolução, impulsionado por uma visão de longo prazo e pelo apoio de uma comunidade engajada. Saiba como você pode se tornar parte fundamental desta jornada.</p>

      <h4><strong>4.1 A Missão: Rumo a um Modelo Próprio</strong></h4>
      <p>Conforme detalhado em nosso roadmap, o objetivo final é desenvolver um modelo de linguagem proprietário para o Nexus, treinado especificamente com dados de alta qualidade para nossas áreas de especialização. O seu apoio através do <strong>Apoia.se</strong> financia esta ambiciosa missão, permitindo a dedicação de tempo e recursos para a curadoria de dados e o oneroso processo de treinamento.</p>

      <h4><strong>4.2 Níveis de Apoio e Recompensas</strong></h4>
      <p>Oferecemos diferentes formas de engajamento que concedem benefícios exclusivos em troca do seu apoio:</p>

      <p><strong>Nexus Pro (R$ 15,00/mês)</strong></p>
      <p>Este é o nível de apoio principal para utilizadores que desejam extrair o máximo da plataforma. Como apoiador Pro, você recebe:</p>
      <ul>
        <li><strong>Acesso Ilimitado ao Modelo Nexus Pro:</strong> Utilize nosso modelo de linguagem mais avançado, ideal para tarefas complexas que exigem máxima criatividade e profundidade.</li>
        <li><strong>Apoio Direto ao Desenvolvimento:</strong> Sua contribuição é diretamente revertida para os custos de manutenção e evolução do projeto.</li>
      </ul>

      <p><strong>Nexus Ultimate (R$ 50,00/mês)</strong></p>
      <p>Para os membros mais dedicados da nossa comunidade que desejam maximizar seu impacto no futuro do Nexus. O nível Ultimate inclui todos os benefícios do Pro, com adicionais significativos:</p>
      <ul>
        <li><strong>Acesso a Todos os Benefícios Pro:</strong> Desfrute do modelo Nexus Pro e de todas as funcionalidades avançadas.</li>
        <li><strong>Acesso Prioritário a Novos Recursos:</strong> Seja o primeiro a testar novas Personas, funcionalidades e versões do modelo antes do lançamento público.</li>
        <li><strong>Impacto Ampliado na Missão:</strong> Sua contribuição acelera significativamente nosso roadmap, aproximando-nos do objetivo de um modelo de linguagem independente.</li>
      </ul>
      <p>Sua participação, em qualquer nível, é o que transforma o Nexus de um projeto em uma realidade em constante crescimento. Agradecemos por acreditar em nossa visão.</p>
    </div>
  );
};

export default Documentation;