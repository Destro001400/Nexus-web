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
                <h1>Documentação Oficial da Plataforma Nexus AI</h1>

                <h2>1. Introdução à Arquitetura Nexus</h2>
                <p>Bem-vindo à documentação oficial do Nexus AI. Este documento serve como um guia abrangente para a utilização, filosofia e arquitetura da nossa plataforma de inteligência artificial. O Nexus foi concebido não como um assistente generalista, mas como uma plataforma especializada, projetada para operar com maestria em domínios criativos e analíticos específicos.</p>
                <p>Nossa missão é fornecer uma ferramenta que atue como uma extensão do intelecto de pesquisadores, escritores e músicos, oferecendo uma parceria criativa e técnica de alta performance. Diferentemente de modelos de linguagem convencionais, o Nexus é estruturado em torno de "Personas": instâncias do modelo fundamental, pré-ajustadas e otimizadas para raciocinar e interagir dentro de um contexto de especialização definido.</p>

                <h2>2. Guia de Início Rápido (First Steps)</h2>
                <p>A interação com o Nexus foi projetada para ser intuitiva, permitindo que o usuário acesse rapidamente a expertise necessária.</p>
                <h3>2.1 Iniciando uma Nova Conversa</h3>
                <p>Toda interação começa na tela principal. O histórico de suas conversas anteriores é armazenado na barra lateral esquerda para fácil acesso e continuidade, permitindo a gestão de múltiplos projetos ou linhas de pesquisa simultaneamente.</p>
                <h3>2.2 O Conceito de "Personas"</h3>
                <p>As Personas são o diferencial estratégico do Nexus. Cada Persona representa uma configuração especializada da IA, pré-carregada com o contexto, o jargão e os modelos de raciocínio de uma área específica. A seleção de uma Persona não é um mero filtro de tópico; é uma instrução para que a IA adote um framework de pensamento completo.</p>
                <h3>2.3 Seleção de Modelo: Nexus Flash e Nexus Pro</h3>
                <p>Oferecemos diferentes níveis de complexidade e performance para atender às suas necessidades:</p>
                <p><strong>Nexus Flash:</strong> Ideal para tarefas rápidas, resumos e interações que exigem agilidade.</p>
                <p><strong>Nexus Pro:</strong> Utiliza um modelo mais robusto, projetado para tarefas que demandam maior profundidade criativa, análise complexa e geração de conteúdo extenso. O acesso ao Nexus Pro está disponível para os apoiadores do projeto (consulte a Seção 4).</p>

                <h2>3. Guia Detalhado das Personas</h2>
                <p>Esta seção aprofunda a capacidade e a aplicação de cada Persona disponível na plataforma.</p>
                
                <h3>3.1 Persona: Pesquisador Acadêmico (Academic Researcher)</h3>
                <p>Esta Persona foi otimizada para o rigor do ambiente acadêmico e científico.</p>
                <p><strong>Descrição:</strong> Atua como um assistente de pesquisa virtual, treinado para compreender e processar informações de artigos científicos, teses e publicações complexas.</p>
                <p><strong>Capacidades Principais:</strong></p>
                <ul>
                    <li>Síntese e Análise Crítica: Gera resumos detalhados, identifica argumentos centrais, metodologias e lacunas em trabalhos de pesquisa.</li>
                    <li>Geração de Hipóteses: Com base no material fornecido, pode sugerir novas direções de pesquisa, questões correlatas e potenciais hipóteses a serem testadas.</li>
                    <li>Assistência de Citação e Formatação: Auxilia na organização de referências e na estruturação de textos segundo normas acadêmicas.</li>
                </ul>
                <p><strong>Exemplos de Prompts Avançados:</strong></p>
                <blockquote><code>"Analise criticamente o artigo [título/link], focando na validade da metodologia estatística empregada e sugira três possíveis críticas que uma banca examinadora poderia levantar."</code></blockquote>
                <blockquote><code>"Com base na teoria de [autor/conceito], gere um resumo estruturado deste documento e proponha uma hipótese de pesquisa original que estenda suas conclusões."</code></blockquote>

                <h3>3.2 Persona: Criação de Textos & Roteiros (Creative Writer & Scripter)</h3>
                <p>Otimizada para a arte da escrita criativa e técnica, desde ficção até a elaboração de roteiros.</p>
                <p><strong>Descrição:</strong> Uma ferramenta de parceria para escritores, roteiristas e criadores de conteúdo que buscam superar o bloqueio criativo e refinar sua arte.</p>
                <p><strong>Capacidades Principais:</strong></p>
                <ul>
                    <li>Desenvolvimento de Narrativas: Auxilia na criação de arcos de personagens, estruturas de enredo (ex: Jornada do Herói), diálogos e descrições cênicas.</li>
                    <li>Escrita Técnica e Copywriting: Gera textos para blogs, documentação técnica, e-mails de marketing e outros conteúdos, com foco em clareza, tom e engajamento.</li>
                    <li>Análise e Refino de Estilo: Pode reescrever passagens para se adequarem a um tom específico (ex: formal, cômico, suspense) ou para melhorar a fluidez e o impacto do texto.</li>
                </ul>
                <p><strong>Exemplos de Prompts Avançados:</strong></p>
                <blockquote><code>"Desenvolva uma cena de diálogo entre um detetive cético e uma testemunha enigmática. O subtexto da conversa deve revelar que a testemunha sabe mais do que aparenta, sem declará-lo explicitamente."</code></blockquote>
                <blockquote><code>"Reescreva o seguinte parágrafo de um artigo técnico sobre [assunto] para um público leigo, utilizando analogias para explicar os conceitos complexos."</code></blockquote>

                <h3>3.3 Persona: Composição Musical (Music Composer)</h3>
                <p>Uma Persona dedicada à arte e à técnica da composição musical, focada principalmente em letras e estruturas.</p>
                <p><strong>Descrição:</strong> Atua como um parceiro de composição para letristas, músicos e produtores, oferecendo tanto inspiração criativa quanto insights técnicos.</p>
                <p><strong>Capacidades Principais:</strong></p>
                <ul>
                    <li>Geração e Desenvolvimento de Letras: Cria letras originais com base em temas, gêneros e estilos específicos. Auxilia na busca por rimas ricas, metáforas e no desenvolvimento da narrativa lírica.</li>
                    <li>Análise e Sugestão Estrutural: Sugere estruturas de canções (verso, pré-refrão, refrão, ponte), progressões de acordes comuns em determinados gêneros e ideias para arranjos.</li>
                    <li>Exploração de Conceitos e Temas: Ajuda a realizar brainstormings de conceitos para novas músicas, explorando diferentes ângulos e abordagens para um mesmo tema.</li>
                </ul>
                <p><strong>Exemplos de Prompts Avançados:</strong></p>
                <blockquote><code>"Crie uma letra para uma canção de rock alternativo no estilo dos anos 90. O tema é a nostalgia e a perda da inocência. A estrutura deve ser: Verso 1, Refrão, Verso 2, Refrão, Ponte, Refrão Final com variação."</code></blockquote>
                <blockquote><code>"Estou trabalhando com a progressão de acordes Am-G-C-F. Sugira uma linha melódica para o refrão e desenvolva um conceito lírico que combine com a sensação melancólica dessa harmonia."</code></blockquote>

                <h2>4. Nexus Pro & Ultimate: Apoiando o Futuro da Plataforma</h2>
                <p>O Nexus é um projeto independente, impulsionado pela paixão pela tecnologia e pelo apoio de nossa comunidade. Para garantir seu desenvolvimento contínuo e financiar a complexa jornada de treinar nosso próprio modelo de linguagem, oferecemos níveis de apoio através da plataforma Apoia.se.</p>
                
                <h3>4.1 Nível: Nexus Pro (R$ 15/mês)</h3>
                <p>O nível Pro é projetado para usuários que buscam a máxima performance da plataforma.</p>
                <ul>
                    <li>Acesso ao Modelo Nexus Pro: Utilize nosso modelo mais avançado e criativo, ideal para tarefas que exigem maior profundidade e geração de conteúdo de alta qualidade.</li>
                    <li>Suporte Prioritário: Seus feedbacks e solicitações de suporte são tratados com prioridade por nossa equipe.</li>
                    <li>Impacto Direto: Sua contribuição mensal é fundamental para cobrir os custos operacionais (servidores, APIs) e nos permite dedicar mais tempo ao desenvolvimento.</li>
                </ul>

                <h3>4.2 Nível: Nexus Ultimate (R$ 50/mês)</h3>
                <p>O nível Ultimate é para os apoiadores que desejam maximizar seu impacto e se tornar parceiros estratégicos no crescimento do Nexus.</p>
                <ul>
                    <li>Todos os Benefícios do Nexus Pro: Acesso irrestrito ao modelo Pro e suporte prioritário.</li>
                    <li>Acesso Antecipado a Novos Recursos: Seja o primeiro a testar e dar feedback sobre novas Personas, funcionalidades e melhorias na plataforma antes do lançamento público.</li>
                    <li>Impulsionando a Missão: Sua contribuição significativa acelera diretamente nossa capacidade de adquirir datasets de alta qualidade e investir em recursos computacionais para o treinamento do nosso modelo de linguagem proprietário. Você é um pilar central na construção do futuro do Nexus.</li>
                </ul>

                <h2>5. Política de Transparência, Processamento de Dados e Aprimoramento de Modelo</h2>
                <p><em>Data de Efetivação: 11 de Outubro de 2025</em></p>

                <h3>5.1 Introdução e Escopo</h3>
                <p>Esta política detalha os princípios operacionais, o processamento de dados e os termos de uso relativos à plataforma Nexus AI ("Nexus", "Plataforma", "Serviço"). Nosso compromisso fundamental é com a transparência total perante nossos usuários ("Usuário", "Você"). Ao utilizar os serviços do Nexus, você reconhece ter lido, compreendido e concordado com os termos aqui descritos.</p>

                <h3>5.2 Arquitetura Tecnológica e Provisão do Serviço Atual</h3>
                <p>Para assegurar um serviço de alta performance, estabilidade e qualidade superior desde sua concepção, a atual iteração da plataforma Nexus opera utilizando a infraestrutura e os modelos de linguagem fornecidos pela API do Google Gemini.</p>
                <p>Esta é uma decisão estratégica que nos permite focar no desenvolvimento da experiência do usuário, na arquitetura da plataforma e, mais crucialmente, na curadoria dos datasets especializados que formarão a base de nosso futuro modelo proprietário. Consequentemente, as interações, prompts e solicitações enviadas por você à plataforma são processados pelos servidores do Google para a geração das respostas. O Nexus atua como a interface inteligente e a camada de aplicação que gerencia essa interação.</p>

                <h3>5.3 Coleta e Utilização de Dados para o Desenvolvimento do Modelo Proprietário</h3>
                <p>O objetivo primário e a missão de longo prazo da Nexus AI Corp. é o desenvolvimento de um modelo de linguagem proprietário, otimizado e especializado para os domínios de Pesquisa Acadêmica, Criação de Textos e Composição Musical. A concretização deste objetivo depende intrinsecamente da análise de um vasto volume de interações contextuais.</p>
                <p><strong>Consentimento de Uso:</strong> Ao utilizar a plataforma Nexus, você concede consentimento explícito para que os dados de suas conversas (prompts e respostas geradas) sejam coletados, armazenados e utilizados para fins de pesquisa, desenvolvimento e treinamento dos algoritmos de inteligência artificial do Nexus.</p>
                <p><strong>Finalidade da Coleta:</strong> Os dados coletados são utilizados estritamente para:</p>
                <ul>
                    <li>Treinamento e Refinamento de Algoritmos: Aprimorar a capacidade do modelo em compreender, raciocinar e gerar conteúdo relevante e coerente.</li>
                    <li>Mitigação de Vieses e Erros: Identificar, analisar e corrigir vieses sistêmicos e padrões de erro no comportamento do modelo.</li>
                    <li>Aprimoramento das "Personas": Aumentar a especialização contextual de cada Persona, garantindo que sua performance exceda a de modelos generalistas.</li>
                </ul>

                <h3>5.4 Compromisso com a Privacidade e Anonimização de Dados</h3>
                <p>A privacidade de nossos usuários é um pilar não negociável de nossa operação. Embora utilizemos os dados das conversas para treinamento, implementamos protocolos rigorosos para proteger a identidade dos usuários.</p>
                <p><strong>Processo de Anonimização:</strong> Antes de serem incorporados a qualquer dataset de treinamento, os dados passam por um processo de anonimização. Este processo visa remover ou dissociar quaisquer Informações de Identificação Pessoal (PII - Personally Identifiable Information), como nomes, endereços de e-mail, números de telefone ou outros dados sensíveis que possam ter sido inseridos durante uma conversa. Nosso foco analítico reside nos padrões linguísticos e estruturais da conversa, não na identidade de quem a gerou.</p>
                <p>O Nexus não compartilha dados brutos de conversas com terceiros, exceto conforme necessário para a provisão do serviço através da API do Google Gemini, sujeito às políticas de privacidade do Google.</p>

                <h2>6. Contato e Suporte Técnico</h2>
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