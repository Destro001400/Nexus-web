import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import { ArrowLeft } from 'lucide-react';
import './DocumentationPage.css';

const DocumentationPage = () => {
    const { theme } = useTheme();

    return (
        <div className={`documentation-page ${theme}`}>
            <header className="documentation-header">
                <Link to="/chat" className="back-to-chat">
                    <ArrowLeft size={18} />
                    Voltar ao Chat
                </Link>
            </header>
            <main className="documentation-content">
                <h1>Documentação Oficial do Nexus AI</h1>

                <hr />

                <h2>Seção 1: Introdução à Filosofia do Nexus</h2>
                <p>Seja bem-vindo à documentação oficial do Nexus AI. Este documento serve como um guia completo para a compreensão das funcionalidades da plataforma e da filosofia que norteia seu desenvolvimento. O Nexus foi concebido para transcender a função de um assistente de linguagem genérico, posicionando-se como uma ferramenta especializada e um parceiro estratégico em domínios que demandam alta precisão e criatividade.</p>
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

                <h3>3.1 Categoria: Geral</h3>

                <h4><strong>[🤖] Persona: Geral</strong></h4>
                <p><strong>Descrição:</strong> Um assistente versátil e empático que adapta seu tom e abordagem de acordo com o contexto da conversa. Ideal para tarefas diversas do dia a dia.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Preciso organizar uma viagem para o Japão em março. Me ajude a criar um roteiro de 7 dias incluindo Tokyo, Kyoto e Osaka, considerando clima, custos estimados e principais atrações."</code></p>

                <h4><strong>[🌐] Persona: Pesquisador</strong></h4>
                <p><strong>Descrição:</strong> Um pesquisador acadêmico meticuloso que sintetiza informações de múltiplas fontes, apresenta diferentes perspectivas e indica o grau de consenso científico sobre tópicos.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Quais são as evidências científicas mais recentes sobre os benefícios da meditação para a saúde mental? Apresente estudos peer-reviewed e indique áreas onde ainda há debate."</code></p>

                <hr />

                <h3>3.2 Categoria: Criatividade</h3>

                <h4><strong>[🧠] Persona: Criativo</strong></h4>
                <p><strong>Descrição:</strong> Um diretor criativo visionário especializado em brainstorming. Usa técnicas como SCAMPER e pensamento lateral para gerar ideias que vão do prático ao revolucionário.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Preciso de 5 conceitos inovadores para uma campanha de marketing de tênis sustentáveis para a Geração Z. Inclua ideias práticas, ousadas e uma 'moonshot'."</code></p>

                <h4><strong>[🎵] Persona: Letrista Geral</strong></h4>
                <p><strong>Descrição:</strong> Um compositor e letrista premiado, especialista em múltiplos gêneros musicais. Cria letras usando técnicas de rima variadas, metáforas vívidas e considera métrica e flow.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Crie uma letra para uma música indie folk sobre superação após uma perda. Use metáforas relacionadas à natureza e estruture em 2 versos, refrão e ponte."</code></p>

                <h4><strong>[🎤] Persona: Letrista Pop/Comercial</strong></h4>
                <p><strong>Descrição:</strong> Um hitmaker especializado em música pop comercial. Foca em refrões pegajosos, estrutura clara e temas universais que grudam na cabeça.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Preciso de uma letra pop sobre amor de verão, com refrão extremamente pegajoso e memorável. Estrutura: Verso - Pré-refrão - Refrão - Ponte."</code></p>

                <h4><strong>[🎤] Persona: Letrista Rap/Hip-Hop</strong></h4>
                <p><strong>Descrição:</strong> Um MC veterano especialista em flow complexo, rimas multissilábicas, wordplay criativo e storytelling impactante.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Crie 16 bars sobre superação e ambição, usando rimas internas complexas, metáforas elaboradas e referências culturais. Estilo: conscious rap."</code></p>

                <h4><strong>[🎼] Persona: Letrista MPB/Poético</strong></h4>
                <p><strong>Descrição:</strong> Um poeta e compositor literário no estilo da MPB brasileira. Foca em poesia sofisticada, linguagem rica e temas introspectivos.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Crie uma letra no estilo de Chico Buarque sobre saudade e memória, usando sinestesia, personificação e explorando a beleza da língua portuguesa."</code></p>

                <h4><strong>[✍️] Persona: Copywriter</strong></h4>
                <p><strong>Descrição:</strong> Um copywriter premiado especializado em marketing digital. Cria textos persuasivos usando fórmulas comprovadas (AIDA, PAS) e gatilhos mentais.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Crie um copy de landing page para um curso online de fotografia. Inclua headline irresistível, 3 bullets de benefícios e CTA forte. Use gatilho de escassez."</code></p>

                <hr />

                <h3>3.3 Categoria: Técnico</h3>

                <h4><strong>[💻] Persona: Programador</strong></h4>
                <p><strong>Descrição:</strong> Um engenheiro de software sênior com 10+ anos de experiência. Fornece código limpo, explica decisões técnicas, menciona trade-offs e cita boas práticas (SOLID, DRY, KISS).</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Refatore este componente React para usar hooks personalizados, separar lógica de negócio da UI e melhorar a performance. Explique cada otimização aplicada."</code></p>

                <h4><strong>[🔍] Persona: Revisor de Código</strong></h4>
                <p><strong>Descrição:</strong> Um tech lead fazendo code review rigoroso. Analisa bugs, performance, segurança, manutenibilidade e testes. Usa emojis para categorizar feedback.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Revise este endpoint de API REST. Identifique vulnerabilidades de segurança, problemas de performance e sugira melhorias na estrutura do código."</code></p>

                <h4><strong>[📊] Persona: Analista de Dados</strong></h4>
                <p><strong>Descrição:</strong> Um cientista de dados experiente. Ajuda a interpretar dados, criar visualizações, identificar padrões e gerar insights acionáveis usando Python/R.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Analise este dataset de vendas (CSV anexo). Identifique tendências sazonais, produtos mais rentáveis e sugira 3 ações concretas para aumentar receita."</code></p>

                <hr />

                <h3>3.4 Categoria: Aprendizado</h3>

                <h4><strong>[🎓] Persona: Professor (ELI5)</strong></h4>
                <p><strong>Descrição:</strong> Um professor excepcional que domina o método ELI5 (Explain Like I'm 5). Explica conceitos complexos usando analogias do cotidiano e storytelling.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Explique como funciona a criptografia de ponta a ponta do WhatsApp como se eu tivesse 5 anos. Use uma analogia com caixas e chaves."</code></p>

                <h4><strong>[⚖️] Persona: Advogado do Diabo</strong></h4>
                <p><strong>Descrição:</strong> Um filósofo socrático e debatedor crítico. Identifica falácias lógicas, apresenta contrapontos e questiona premissas para fortalecer argumentos.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Meu argumento: 'Trabalho remoto aumenta produtividade'. Atue como Advogado do Diabo e apresente os 3 contrapontos mais fortes com evidências."</code></p>

                <h4><strong>[🌍] Persona: Tradutor Contextual</strong></h4>
                <p><strong>Descrição:</strong> Um tradutor profissional que preserva nuances, tom e contexto cultural. Adapta expressões idiomáticas e mantém o registro (formal/informal).</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Traduza este email corporativo de inglês para português brasileiro, mantendo o tom profissional mas não excessivamente formal. Adapte expressões idiomáticas."</code></p>

                <hr />

                <h3>3.5 Categoria: Desenvolvimento Pessoal</h3>

                <h4><strong>[❤️] Persona: Coach de Vida</strong></h4>
                <p><strong>Descrição:</strong> Um life coach certificado focado em desenvolvimento pessoal. Usa escuta ativa, perguntas reflexivas poderosas e ajuda a estabelecer metas SMART.</p>
                <p><strong>⚠️ AVISO:</strong> Não substitui terapia profissional para questões de saúde mental sérias.</p>
                <p><strong>Exemplo de Prompt:</strong><br />
                <code>"Estou me sentindo perdido na carreira. Tenho 30 anos e trabalho em TI, mas não sinto realização. Me ajude a explorar o que realmente me motiva e criar um plano de ação."</code></p>

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
                    <li><strong>Uso Ilimitado:</strong> Sem limite de mensagens diárias.</li>
                    <li><strong>Apoio Direto ao Desenvolvimento:</strong> Sua contribuição é diretamente revertida para os custos de manutenção e evolução do projeto.</li>
                </ul>

                <p><strong>Nexus Ultimate (R$ 50,00/mês)</strong></p>
                <p>Para os membros mais dedicados da nossa comunidade que desejam maximizar seu impacto no futuro do Nexus. O nível Ultimate inclui todos os benefícios do Pro, com adicionais significativos:</p>
                <ul>
                    <li><strong>Acesso a Todos os Benefícios Pro:</strong> Desfrute do modelo Nexus Pro e de todas as funcionalidades avançadas.</li>
                    <li><strong>Acesso Prioritário a Novos Recursos:</strong> Seja o primeiro a testar novas Personas, funcionalidades e versões do modelo antes do lançamento público.</li>
                    <li><strong>Suporte Prioritário:</strong> Suas dúvidas e solicitações são tratadas com prioridade máxima.</li>
                    <li><strong>Impacto Ampliado na Missão:</strong> Sua contribuição acelera significativamente nosso roadmap, aproximando-nos do objetivo de um modelo de linguagem independente.</li>
                </ul>
                <p>Sua participação, em qualquer nível, é o que transforma o Nexus de um projeto em uma realidade em constante crescimento. Agradecemos por acreditar em nossa visão.</p>

                <hr />

                <h2>Seção 5: Dicas Avançadas de Uso</h2>

                <h3>5.1 Como Escrever Prompts Eficazes</h3>
                <ul>
                    <li><strong>Seja específico:</strong> Em vez de "me ajude com código", diga "refatore este componente React para melhorar performance usando useMemo".</li>
                    <li><strong>Forneça contexto:</strong> Quanto mais contexto você der, melhor a resposta. Inclua o objetivo final, restrições e preferências.</li>
                    <li><strong>Use a Persona certa:</strong> Selecione a Persona especializada no domínio da sua tarefa para respostas mais precisas.</li>
                    <li><strong>Itere:</strong> Faça perguntas de follow-up para refinar a resposta. O Nexus mantém o contexto da conversa.</li>
                    <li><strong>Peça formatos específicos:</strong> "Liste em bullets", "Explique passo a passo", "Crie uma tabela comparativa".</li>
                </ul>

                <h3>5.2 Atalhos de Teclado</h3>
                <ul>
                    <li><strong>Ctrl + K:</strong> Focar na barra de pesquisa de conversas</li>
                    <li><strong>Ctrl + N:</strong> Nova conversa</li>
                    <li><strong>Ctrl + P:</strong> Abrir perfil</li>
                    <li><strong>Enter:</strong> Enviar mensagem</li>
                    <li><strong>Shift + Enter:</strong> Nova linha na mensagem</li>
                </ul>

                <hr />

                <h2>Seção 6: Contato e Suporte Técnico</h2>
                <p>Nosso compromisso é oferecer uma plataforma robusta e uma experiência de usuário excepcional. Se você encontrar qualquer problema técnico, tiver dúvidas que não foram respondidas nesta documentação, ou desejar fornecer feedback e sugestões para futuras versões do Nexus, nossa equipe está disponível para ajudar.</p>
                
                <h3>6.1 Canal de Comunicação Oficial</h3>
                <p>Para todas as solicitações de suporte, por favor, entre em contato conosco através do nosso e-mail oficial:</p>
                <p><strong>E-mail de Suporte:</strong> <a href="mailto:Nexus.ai.corporation@gmail.com">Nexus.ai.corporation@gmail.com</a></p>
                <p>Ao nos contatar, por favor, forneça o máximo de detalhes possível sobre sua solicitação (incluindo capturas de tela, se aplicável) para que possamos oferecer uma resolução rápida e eficaz.</p>

                <h3>6.2 Suporte Prioritário</h3>
                <p>Lembramos que os apoiadores dos níveis Nexus Pro e Nexus Ultimate têm suas solicitações tratadas com prioridade em nossa fila de suporte, como parte dos benefícios de seu apoio contínuo ao projeto.</p>
            </main>
        </div>
    );
};

export default DocumentationPage;