export interface RedacaoNota1000 {
  id: string
  ano: number
  tema: string
  nota: number
  texto: string
  estrutura: {
    organizacao: string
    argumentacao: string
    pontosFortes: string[]
  }
  competencias: {
    competencia1: { nota: number; feedback: string }
    competencia2: { nota: number; feedback: string }
    competencia3: { nota: number; feedback: string }
    competencia4: { nota: number; feedback: string }
    competencia5: { nota: number; feedback: string }
  }
  tecnicas: {
    utilizadas: string[]
    repertorioSociocultural: string[]
  }
}

export const redacoesNota1000: RedacaoNota1000[] = [
  {
    id: 'enem-2022-1',
    ano: 2022,
    tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    nota: 1000,
    texto: `A Constituição Federal de 1988, norma de maior hierarquia no sistema jurídico brasileiro, garante a todos os cidadãos o direito à cultura e ao reconhecimento de suas práticas tradicionais. Entretanto, observa-se que, na prática, comunidades e povos tradicionais - como indígenas, quilombolas e ribeirinhos - enfrentam desafios significativos para terem suas culturas valorizadas e preservadas. Essa problemática decorre, principalmente, da invisibilidade social desses grupos e da insuficiência de políticas públicas efetivas, o que demanda atenção e ação urgente.

Em primeiro lugar, é fundamental destacar que a invisibilidade social dos povos tradicionais constitui um entrave para a valorização de suas culturas. Segundo o sociólogo Fernando Braga da Costa, a invisibilidade pública ocorre quando determinados grupos são sistematicamente ignorados pela sociedade, tornando-se "transparentes" no cotidiano. Esse fenômeno se manifesta, por exemplo, quando as comunidades indígenas têm suas terras invadidas e seus direitos violados sem que haja grande repercussão na mídia ou mobilização popular. Além disso, a falta de representatividade desses povos em espaços de decisão política agrava o problema, uma vez que suas demandas não são adequadamente consideradas na elaboração de políticas públicas. Dessa forma, a superação da invisibilidade social é imprescindível para que essas comunidades sejam reconhecidas e valorizadas.

Ademais, a insuficiência de políticas públicas para a proteção e promoção das culturas tradicionais intensifica os desafios enfrentados por esses grupos. De acordo com dados do Instituto Brasileiro de Geografia e Estatística (IBGE), muitas comunidades tradicionais vivem em condições precárias, sem acesso a serviços básicos como saúde, educação e saneamento. Essa negligência do Estado não apenas viola direitos fundamentais, mas também dificulta a transmissão de conhecimentos e práticas culturais para as gerações futuras. Um exemplo disso é a situação dos povos ribeirinhos da Amazônia, que enfrentam a degradação ambiental e a falta de apoio governamental, o que compromete seu modo de vida tradicional e sustentável. Portanto, é essencial que o poder público implemente políticas efetivas de proteção e valorização desses grupos.

Diante do exposto, fica evidente a necessidade de medidas concretas para enfrentar os desafios apresentados. Assim, cabe ao Ministério da Cultura, em parceria com o Ministério dos Povos Indígenas, criar campanhas de conscientização nacional - por meio de plataformas digitais, programas de televisão e eventos culturais - com o objetivo de dar visibilidade às comunidades tradicionais e promover o respeito à diversidade cultural. Além disso, é fundamental que o Congresso Nacional aprove legislações que garantam a demarcação de terras indígenas e quilombolas, assegurando os direitos constitucionais desses povos. Somente dessa forma será possível construir uma sociedade mais justa e plural, na qual todas as culturas sejam igualmente valorizadas e preservadas.`,
    estrutura: {
      organizacao: 'Estrutura dissertativa-argumentativa perfeita com introdução clara (apresentação do tema + tese), desenvolvimento com dois argumentos bem fundamentados e conclusão com proposta de intervenção completa seguindo os 5 elementos.',
      argumentacao: 'Argumentação sólida baseada em: (1) invisibilidade social dos povos tradicionais com referência ao sociólogo Fernando Braga da Costa; (2) insuficiência de políticas públicas com dados do IBGE. Uso exemplar de repertório sociocultural legitimado.',
      pontosFortes: [
        'Introdução com contextualização e tese clara',
        'Dois argumentos bem desenvolvidos com repertório diversificado',
        'Proposta de intervenção completa com os 5 elementos (ação, agente, modo, finalidade, detalhamento)',
        'Excelente uso de conectivos',
        'Domínio da norma culta sem desvios'
      ]
    },
    competencias: {
      competencia1: {
        nota: 200,
        feedback: 'Demonstra excelente domínio da modalidade escrita formal da língua portuguesa. Texto sem desvios gramaticais, com vocabulário preciso e adequado.'
      },
      competencia2: {
        nota: 200,
        feedback: 'Compreende perfeitamente a proposta de redação e aplica conceitos das várias áreas do conhecimento de forma exemplar, desenvolvendo o tema com profundidade.'
      },
      competencia3: {
        nota: 200,
        feedback: 'Seleciona, relaciona, organiza e interpreta informações de forma coerente. Argumentação consistente em defesa do ponto de vista com repertório sociocultural produtivo (Fernando Braga da Costa, IBGE, Constituição Federal).'
      },
      competencia4: {
        nota: 200,
        feedback: 'Articula perfeitamente as partes do texto com uso diversificado e adequado de conectivos ("Entretanto", "Em primeiro lugar", "Ademais", "Dessa forma", "Portanto", "Diante do exposto").'
      },
      competencia5: {
        nota: 200,
        feedback: 'Elabora proposta de intervenção completa, detalhada e relacionada à tese. Apresenta todos os 5 elementos: Ação (campanhas de conscientização e legislações), Agente (Ministério da Cultura, Ministério dos Povos Indígenas, Congresso Nacional), Modo (plataformas digitais, TV, eventos, aprovação de leis), Finalidade (dar visibilidade e promover respeito), Detalhamento (demarcação de terras).'
      }
    },
    tecnicas: {
      utilizadas: [
        'Contextualização com lei (Constituição Federal)',
        'Citação de autor (Fernando Braga da Costa)',
        'Uso de dados estatísticos (IBGE)',
        'Exemplificação concreta (povos ribeirinhos da Amazônia)',
        'Comparação histórica implícita',
        'Conectivos variados e precisos',
        'Proposta de intervenção com 5 elementos'
      ],
      repertorioSociocultural: [
        'Constituição Federal de 1988',
        'Sociólogo Fernando Braga da Costa - conceito de invisibilidade pública',
        'Dados do IBGE sobre comunidades tradicionais',
        'Ministério da Cultura',
        'Ministério dos Povos Indígenas',
        'Situação dos povos ribeirinhos da Amazônia'
      ]
    }
  },
  {
    id: 'enem-2021-1',
    ano: 2021,
    tema: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    nota: 1000,
    texto: `A Declaração Universal dos Direitos Humanos, promulgada em 1948 pela Organização das Nações Unidas (ONU), assegura a todo indivíduo o direito ao reconhecimento de sua personalidade jurídica. No Brasil, essa garantia está intrinsecamente relacionada ao registro civil de nascimento, documento que confere identidade e permite o acesso a direitos fundamentais. Contudo, a persistência de um contingente significativo de pessoas sem registro civil evidencia uma problemática que compromete o exercício pleno da cidadania. Esse cenário decorre, principalmente, da falta de informação e do difícil acesso aos cartórios, sobretudo em regiões remotas, demandando ações efetivas para sua superação.

Primeiramente, é importante reconhecer que a ausência de informação sobre a importância do registro civil contribui para a perpetuação da invisibilidade jurídica. Segundo dados da Fundação Abrinq, milhares de crianças brasileiras não são registradas ao nascer, especialmente em áreas rurais e em comunidades de baixa renda. Essa situação é agravada pelo desconhecimento dos pais acerca dos procedimentos necessários e da gratuidade do serviço, conforme estabelecido pela Lei nº 9.534/97. Assim, a falta de campanhas educativas por parte do poder público impede que muitas famílias tenham acesso a esse direito básico, resultando na exclusão social e na impossibilidade de acessar serviços essenciais como saúde e educação.

Além disso, o difícil acesso aos cartórios em regiões distantes dos centros urbanos constitui uma barreira significativa para a efetivação do registro civil. De acordo com o Instituto Brasileiro de Geografia e Estatística (IBGE), muitos municípios brasileiros, especialmente na região Norte, possuem apenas um cartório para atender uma vasta área geográfica. Essa realidade impõe às famílias desafios logísticos e financeiros para se deslocarem até os locais de registro, o que muitas vezes inviabiliza o cumprimento dessa obrigação legal. Consequentemente, crianças e adultos permanecem sem documentação, tornando-se invisíveis perante o Estado e a sociedade, o que reforça desigualdades e limita oportunidades de desenvolvimento pessoal e profissional.

Diante do exposto, torna-se imprescindível a adoção de medidas que garantam o acesso universal ao registro civil. Portanto, cabe ao Ministério da Cidadania, em parceria com prefeituras municipais, promover campanhas de conscientização sobre a importância do registro civil, por meio de cartilhas educativas, anúncios em rádios comunitárias e visitas de agentes de saúde às comunidades mais isoladas, a fim de informar as famílias sobre seus direitos e os procedimentos necessários. Ademais, é fundamental que os Tribunais de Justiça estaduais implementem unidades móveis de registro civil, levando o serviço até as regiões de difícil acesso, assegurando assim que nenhum cidadão permaneça invisível juridicamente. Somente por meio dessas ações integradas será possível efetivar o direito à identidade e promover uma sociedade mais justa e inclusiva.`,
    estrutura: {
      organizacao: 'Estrutura impecável seguindo o padrão dissertativo-argumentativo com introdução (contextualização + tese), desenvolvimento em dois parágrafos (cada um com um argumento bem desenvolvido) e conclusão com proposta de intervenção detalhada.',
      argumentacao: 'Argumentação robusta com uso de: (1) repertório legitimado (Declaração Universal dos Direitos Humanos, Lei nº 9.534/97); (2) dados concretos (Fundação Abrinq, IBGE); (3) análise crítica da realidade social brasileira. Coesão perfeita entre os parágrafos.',
      pontosFortes: [
        'Introdução com repertório legitimado (ONU)',
        'Tese bem delimitada e clara',
        'Dois argumentos distintos e bem fundamentados',
        'Uso exemplar de dados estatísticos',
        'Proposta de intervenção com todos os elementos exigidos',
        'Domínio total dos conectivos',
        'Zero desvios gramaticais'
      ]
    },
    competencias: {
      competencia1: {
        nota: 200,
        feedback: 'Excelente domínio da norma culta com vocabulário sofisticado e preciso. Não apresenta desvios gramaticais, demonstrando pleno conhecimento das estruturas da língua portuguesa.'
      },
      competencia2: {
        nota: 200,
        feedback: 'Compreensão perfeita do tema com desenvolvimento profundo e crítico. Aplica conceitos de sociologia, direito e políticas públicas de forma integrada e coerente.'
      },
      competencia3: {
        nota: 200,
        feedback: 'Seleção impecável de informações com repertório sociocultural legitimado e produtivo (Declaração Universal dos Direitos Humanos, Lei nº 9.534/97, Fundação Abrinq, IBGE). Argumentação consistente com defesa clara do ponto de vista.'
      },
      competencia4: {
        nota: 200,
        feedback: 'Articulação exemplar das partes do texto com uso variado de recursos coesivos ("Contudo", "Primeiramente", "Além disso", "Consequentemente", "Diante do exposto", "Portanto", "Ademais", "Somente").'
      },
      competencia5: {
        nota: 200,
        feedback: 'Proposta de intervenção completa e detalhada com todos os 5 elementos: Ação (campanhas de conscientização e unidades móveis), Agente (Ministério da Cidadania, prefeituras, Tribunais de Justiça), Modo (cartilhas, rádios, agentes de saúde, unidades móveis), Finalidade (informar famílias e assegurar acesso), Detalhamento (especificação das ações concretas).'
      }
    },
    tecnicas: {
      utilizadas: [
        'Contextualização histórica internacional (ONU)',
        'Referência a legislação brasileira (Lei nº 9.534/97)',
        'Dados de instituições respeitadas (Fundação Abrinq, IBGE)',
        'Análise geográfica (região Norte)',
        'Conectivos de alta qualidade',
        'Proposta de intervenção com detalhamento exemplar'
      ],
      repertorioSociocultural: [
        'Declaração Universal dos Direitos Humanos (ONU, 1948)',
        'Lei nº 9.534/97 (gratuidade do registro civil)',
        'Dados da Fundação Abrinq',
        'Estatísticas do IBGE',
        'Ministério da Cidadania',
        'Tribunais de Justiça estaduais',
        'Conceito de invisibilidade jurídica'
      ]
    }
  },
  {
    id: 'enem-2019-1',
    ano: 2019,
    tema: 'Democratização do acesso ao cinema no Brasil',
    nota: 1000,
    texto: `A sétima arte, como é conhecido o cinema, possui um papel fundamental na formação cultural e social dos indivíduos, sendo uma importante ferramenta de reflexão sobre a realidade contemporânea. No Brasil, entretanto, o acesso a essa manifestação artística ainda é bastante restrito, concentrando-se nas grandes cidades e entre as classes sociais mais favorecidas economicamente. Essa problemática decorre, principalmente, da desigual distribuição de salas de cinema pelo território nacional e dos elevados preços dos ingressos, o que exige medidas urgentes para democratizar o acesso a essa forma de expressão cultural.

Em primeira análise, é fundamental destacar que a concentração de salas de cinema nas regiões mais desenvolvidas do país constitui uma barreira significativa ao acesso democrático à sétima arte. Segundo dados do Observatório Brasileiro do Cinema e do Audiovisual, cerca de 90% dos municípios brasileiros não possuem sequer uma sala de exibição, situação que se agrava nas regiões Norte e Nordeste. Esse cenário reflete a lógica de mercado que privilegia áreas com maior poder aquisitivo em detrimento de regiões periféricas, excluindo milhões de brasileiros do contato com produções cinematográficas nacionais e internacionais. Assim, a ausência de infraestrutura adequada impede que o cinema cumpra sua função social de democratização da cultura e de formação crítica dos cidadãos.

Além disso, os elevados preços dos ingressos funcionam como um mecanismo de exclusão social, impedindo que grande parte da população tenha acesso regular às salas de cinema. De acordo com pesquisa do Instituto Locomotiva, o brasileiro vai ao cinema, em média, apenas uma vez por ano, enquanto em países desenvolvidos essa frequência é significativamente maior. Essa realidade está diretamente relacionada ao fato de que o preço do ingresso representa uma parcela considerável do orçamento das famílias de baixa renda, tornando o cinema um artigo de luxo inacessível. Ademais, a concentração de complexos cinematográficos em shopping centers - espaços elitizados - reforça a segregação espacial e econômica, afastando ainda mais as classes populares dessa experiência cultural.

Diante do exposto, são necessárias ações concretas para reverter esse quadro de desigualdade. Portanto, cabe ao Ministério da Cultura, em parceria com prefeituras municipais, criar e financiar projetos de cinemas itinerantes nas regiões mais afastadas dos grandes centros urbanos, utilizando praças públicas e escolas como espaços de exibição, a fim de levar o cinema para perto da população que não tem acesso a salas convencionais. Além disso, é imprescindível que o governo federal estabeleça, por meio de lei, a obrigatoriedade de sessões com preços reduzidos em todos os cinemas do país, especialmente em dias e horários estratégicos, garantindo que as classes menos favorecidas possam usufruir desse direito cultural. Somente assim será possível democratizar efetivamente o acesso ao cinema no Brasil, promovendo inclusão social e enriquecimento cultural.`,
    estrutura: {
      organizacao: 'Estrutura dissertativa-argumentativa exemplar com introdução contextualizada, desenvolvimento com dois argumentos sólidos (distribuição desigual de salas e preços elevados) e conclusão propositiva completa.',
      argumentacao: 'Argumentação consistente baseada em dados oficiais (Observatório Brasileiro do Cinema) e pesquisas (Instituto Locomotiva), além de análise socioeconômica profunda sobre exclusão cultural e segregação espacial.',
      pontosFortes: [
        'Introdução com metáfora cultural ("sétima arte")',
        'Dados estatísticos relevantes e atualizados',
        'Análise crítica da lógica de mercado',
        'Conexão entre exclusão econômica e cultural',
        'Proposta com dois agentes e ações complementares',
        'Coesão textual impecável'
      ]
    },
    competencias: {
      competencia1: {
        nota: 200,
        feedback: 'Domínio pleno da norma culta com construções sintáticas variadas e vocabulário rico. Ausência total de desvios gramaticais.'
      },
      competencia2: {
        nota: 200,
        feedback: 'Compreensão completa do tema com abordagem multidimensional (geográfica, econômica e social). Desenvolvimento profundo e crítico da problemática.'
      },
      competencia3: {
        nota: 200,
        feedback: 'Repertório sociocultural legitimado e produtivo com dados do Observatório Brasileiro do Cinema e Instituto Locomotiva. Argumentação sólida com defesa clara e fundamentada do ponto de vista.'
      },
      competencia4: {
        nota: 200,
        feedback: 'Articulação perfeita entre as partes do texto com uso diversificado de conectivos ("entretanto", "Em primeira análise", "Além disso", "Ademais", "Diante do exposto", "Portanto", "Somente assim").'
      },
      competencia5: {
        nota: 200,
        feedback: 'Proposta de intervenção completa e detalhada: Ação (cinemas itinerantes e sessões com preços reduzidos), Agente (Ministério da Cultura, prefeituras, governo federal), Modo (projetos, praças, escolas, lei), Finalidade (democratizar acesso), Detalhamento (dias e horários estratégicos, regiões afastadas).'
      }
    },
    tecnicas: {
      utilizadas: [
        'Uso de expressão cultural consagrada ("sétima arte")',
        'Dados do Observatório Brasileiro do Cinema',
        'Pesquisa do Instituto Locomotiva',
        'Comparação internacional implícita',
        'Análise de segregação espacial',
        'Crítica à lógica de mercado',
        'Proposta de intervenção dupla e integrada'
      ],
      repertorioSociocultural: [
        'Conceito de "sétima arte"',
        'Dados do Observatório Brasileiro do Cinema e do Audiovisual',
        'Pesquisa do Instituto Locomotiva',
        'Análise geográfica (regiões Norte e Nordeste)',
        'Conceito de segregação espacial e econômica',
        'Lei de Incentivo à Cultura (implícito)',
        'Shopping centers como espaços elitizados'
      ]
    }
  },
  {
    id: 'enem-2018-1',
    ano: 2018,
    tema: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
    nota: 1000,
    texto: `A série britânica "Black Mirror" exibe, em um de seus episódios, um governo autoritário que utiliza o controle de dados dos cidadãos para manipular comportamentos e garantir a ordem social. Embora se trate de uma realidade ficcional, o cenário apresentado não está distante da atual conjuntura brasileira, uma vez que a manipulação do comportamento dos usuários por meio do controle de dados na internet é uma prática recorrente no país. Nesse sentido, torna-se fundamental discutir as causas desse problema, entre as quais se destacam a ausência de uma legislação específica e o uso de algoritmos personalizados.

Em primeira análise, é importante destacar que a falta de uma legislação específica sobre o uso de dados na internet facilita a manipulação dos usuários. Segundo o filósofo contratualista Thomas Hobbes, o Estado é responsável por garantir o bem-estar da população por meio da criação de leis que regulem a vida em sociedade. No entanto, observa-se que, no Brasil, a ausência de uma lei que regulamente o uso de informações pessoais na rede permite que empresas utilizem esses dados de forma abusiva, sem a devida fiscalização ou punição. Exemplo disso foi o escândalo envolvendo a empresa Cambridge Analytica, que coletou informações de milhões de usuários do Facebook para influenciar eleições em diversos países, incluindo o Brasil. Dessa forma, a omissão do poder público contribui para a perpetuação dessa problemática.

Ademais, o uso de algoritmos personalizados por plataformas digitais intensifica o controle sobre o comportamento dos internautas. De acordo com o sociólogo Zygmunt Bauman, a sociedade contemporânea é caracterizada pela "modernidade líquida", em que as relações sociais são mediadas pela tecnologia e pelo consumo. Nesse contexto, empresas como Google e Facebook utilizam algoritmos que analisam o histórico de navegação dos usuários para criar "bolhas de filtro", oferecendo conteúdos personalizados que reforçam crenças preexistentes e limitam o acesso a informações diversas. Consequentemente, esse mecanismo não apenas manipula escolhas de consumo, mas também interfere na formação de opinião política e social dos indivíduos, restringindo o exercício pleno da cidadania.

Diante do exposto, medidas são necessárias para combater a manipulação do comportamento dos usuários na internet. Assim, cabe ao Congresso Nacional aprovar, com urgência, uma legislação específica sobre proteção de dados pessoais - nos moldes da General Data Protection Regulation (GDPR) da União Europeia - que estabeleça regras claras sobre coleta, armazenamento e uso de informações, bem como penalidades para empresas que descumprirem essas normas. Além disso, é imprescindível que o Ministério da Educação, em parceria com escolas e universidades, promova campanhas de conscientização digital, por meio de palestras, oficinas e materiais didáticos, com o objetivo de educar a população sobre os riscos da manipulação de dados e formar cidadãos críticos e conscientes no ambiente virtual. Somente dessa forma será possível evitar que a distopia apresentada em "Black Mirror" se torne realidade no Brasil.`,
    estrutura: {
      organizacao: 'Estrutura dissertativa-argumentativa exemplar com introdução contextualizada (referência cultural), desenvolvimento com dois argumentos sólidos (ausência de legislação e algoritmos personalizados) e conclusão propositiva detalhada com duas ações concretas.',
      argumentacao: 'Argumentação de alto nível com uso de: (1) repertório filosófico (Thomas Hobbes); (2) repertório sociológico (Zygmunt Bauman); (3) exemplo real concreto (escândalo Cambridge Analytica); (4) conceitos técnicos (bolhas de filtro, algoritmos). Demonstra visão crítica e multidisciplinar.',
      pontosFortes: [
        'Introdução criativa com referência cultural ("Black Mirror")',
        'Uso de repertório filosófico e sociológico legitimado',
        'Exemplo real e atual (Cambridge Analytica)',
        'Conceitos técnicos bem explicados (algoritmos, bolhas de filtro)',
        'Proposta dupla e detalhada com referência internacional (GDPR)',
        'Retomada criativa da introdução na conclusão',
        'Coesão impecável com conectivos variados'
      ]
    },
    competencias: {
      competencia1: {
        nota: 200,
        feedback: 'Domínio exemplar da norma culta com vocabulário sofisticado ("contratualista", "modernidade líquida", "perpetuação"). Estruturas sintáticas complexas e variadas, sem qualquer desvio gramatical.'
      },
      competencia2: {
        nota: 200,
        feedback: 'Compreensão profunda do tema com aplicação de conceitos de Filosofia (Hobbes), Sociologia (Bauman), Tecnologia (algoritmos) e Política (legislação). Desenvolvimento crítico e abrangente da problemática.'
      },
      competencia3: {
        nota: 200,
        feedback: 'Repertório sociocultural produtivo e legitimado com referências culturais ("Black Mirror"), filosóficas (Thomas Hobbes), sociológicas (Zygmunt Bauman) e fatos concretos (Cambridge Analytica, GDPR). Argumentação consistente e bem fundamentada.'
      },
      competencia4: {
        nota: 200,
        feedback: 'Articulação perfeita com uso sofisticado de conectivos ("Nesse sentido", "Em primeira análise", "No entanto", "Ademais", "Consequentemente", "Diante do exposto", "Somente dessa forma"). Coesão textual exemplar.'
      },
      competencia5: {
        nota: 200,
        feedback: 'Proposta de intervenção completa e detalhada com dois agentes e ações: (1) Congresso Nacional - legislação específica nos moldes da GDPR com penalidades; (2) Ministério da Educação + escolas - campanhas de conscientização com palestras e oficinas. Apresenta modo, finalidade e detalhamento exemplares.'
      }
    },
    tecnicas: {
      utilizadas: [
        'Contextualização com obra cultural ("Black Mirror")',
        'Citação de filósofo (Thomas Hobbes)',
        'Citação de sociólogo (Zygmunt Bauman)',
        'Exemplo de escândalo real (Cambridge Analytica)',
        'Conceitos técnicos explicados (algoritmos, bolhas de filtro)',
        'Referência a legislação internacional (GDPR)',
        'Retomada circular da introdução na conclusão',
        'Proposta de intervenção dupla e integrada'
      ],
      repertorioSociocultural: [
        'Série "Black Mirror" (crítica social sobre tecnologia)',
        'Thomas Hobbes - teoria contratualista',
        'Zygmunt Bauman - conceito de "modernidade líquida"',
        'Escândalo da Cambridge Analytica',
        'GDPR - General Data Protection Regulation (União Europeia)',
        'Conceito de "bolhas de filtro"',
        'Funcionamento de algoritmos do Facebook e Google'
      ]
    }
  },
  {
    id: 'enem-2017-1',
    ano: 2017,
    tema: 'Desafios para a formação educacional de surdos no Brasil',
    nota: 1000,
    texto: `A Declaração Universal dos Direitos Humanos, promulgada em 1948 pela Organização das Nações Unidas (ONU), assegura a todo indivíduo o direito à educação de qualidade. No Brasil, essa garantia está prevista na Constituição Federal de 1988, que estabelece a educação como direito fundamental de todos os cidadãos. Entretanto, observa-se que pessoas surdas enfrentam diversos obstáculos para terem acesso a uma formação educacional adequada, o que evidencia a distância entre a legislação e a realidade social. Esse cenário decorre, principalmente, da escassez de profissionais qualificados em Língua Brasileira de Sinais (Libras) e da persistência de preconceitos sociais, demandando ações efetivas para sua superação.

Primeiramente, é fundamental reconhecer que a falta de professores capacitados em Libras representa um dos principais entraves à educação de surdos no país. Segundo dados do Censo Escolar, a maioria das escolas brasileiras não dispõe de intérpretes ou docentes fluentes na língua de sinais, o que impossibilita a comunicação adequada entre alunos surdos e a comunidade escolar. Essa deficiência na formação de profissionais especializados está relacionada à insuficiência de cursos de graduação e capacitação em Libras, bem como à baixa valorização dessa área de atuação. Como consequência, estudantes surdos têm seu desempenho acadêmico prejudicado, enfrentando dificuldades de aprendizagem e, muitas vezes, sendo excluídos do processo educacional, o que perpetua desigualdades e limita suas oportunidades de desenvolvimento pessoal e profissional.

Além disso, o preconceito social em relação às pessoas surdas constitui uma barreira significativa para sua inclusão educacional. De acordo com o filósofo Michel Foucault, a sociedade tende a marginalizar grupos considerados "diferentes" por meio de discursos e práticas excludentes. No contexto da surdez, essa exclusão se manifesta quando a deficiência auditiva é tratada como uma limitação que impede o pleno exercício da cidadania, em vez de ser reconhecida como uma diferença linguística e cultural. Exemplo disso é a resistência de muitas instituições de ensino em adaptar suas metodologias e espaços para receber alunos surdos, perpetuando estereótipos e dificultando a convivência entre surdos e ouvintes. Dessa forma, a superação do preconceito é essencial para promover uma educação verdadeiramente inclusiva e respeitosa à diversidade.

Diante do exposto, torna-se imprescindível a adoção de medidas que garantam a formação educacional adequada de pessoas surdas no Brasil. Portanto, cabe ao Ministério da Educação (MEC), em parceria com universidades públicas, ampliar a oferta de cursos de graduação e especialização em Libras, bem como implementar programas de capacitação continuada para professores da rede pública, por meio de bolsas de estudo e incentivos financeiros, com o objetivo de formar profissionais qualificados e aumentar a presença de intérpretes nas escolas. Ademais, é fundamental que o MEC, em conjunto com o Ministério da Mulher, da Família e dos Direitos Humanos, promova campanhas de conscientização sobre a cultura surda e a importância da inclusão, utilizando mídias sociais, programas de televisão e materiais educativos nas escolas, a fim de combater preconceitos e sensibilizar a sociedade. Somente por meio dessas ações integradas será possível garantir que o direito à educação, previsto na Constituição, seja efetivamente assegurado a todos os brasileiros.`,
    estrutura: {
      organizacao: 'Estrutura dissertativa-argumentativa perfeita com introdução contextualizando o tema (Declaração Universal + Constituição), desenvolvimento com dois argumentos bem delimitados (falta de profissionais e preconceito social) e conclusão com proposta dupla e detalhada.',
      argumentacao: 'Argumentação sólida fundamentada em: (1) dados estatísticos (Censo Escolar); (2) repertório filosófico (Michel Foucault); (3) análise crítica das causas estruturais do problema. Conexão clara entre argumentos e consequências sociais.',
      pontosFortes: [
        'Introdução com duplo repertório legitimado (ONU + Constituição)',
        'Tese clara e bem delimitada',
        'Dados concretos (Censo Escolar)',
        'Repertório filosófico aplicado corretamente (Foucault)',
        'Reconhecimento da surdez como diferença cultural',
        'Proposta de intervenção dupla com agentes específicos',
        'Coesão exemplar entre parágrafos',
        'Vocabulário técnico adequado (Libras, intérpretes, inclusão)'
      ]
    },
    competencias: {
      competencia1: {
        nota: 200,
        feedback: 'Excelente domínio da norma culta da língua portuguesa com vocabulário preciso e técnico. Estruturas sintáticas elaboradas e sem desvios gramaticais, demonstrando pleno conhecimento da modalidade escrita formal.'
      },
      competencia2: {
        nota: 200,
        feedback: 'Compreensão profunda do tema com aplicação de conceitos de Direito (Constituição Federal), Educação Inclusiva, Filosofia (Foucault) e Políticas Públicas. Abordagem crítica e multidimensional da problemática.'
      },
      competencia3: {
        nota: 200,
        feedback: 'Repertório sociocultural legitimado e produtivo: Declaração Universal dos Direitos Humanos, Constituição Federal de 1988, dados do Censo Escolar, teoria de Michel Foucault sobre marginalização. Argumentação consistente com defesa clara do ponto de vista.'
      },
      competencia4: {
        nota: 200,
        feedback: 'Articulação impecável das partes do texto com uso variado de mecanismos coesivos ("Entretanto", "Primeiramente", "Como consequência", "Além disso", "Dessa forma", "Diante do exposto", "Portanto", "Ademais", "Somente por meio").'
      },
      competencia5: {
        nota: 200,
        feedback: 'Proposta de intervenção completa e detalhada com todos os elementos: (1) MEC + universidades - ampliar cursos de Libras com bolsas e incentivos; (2) MEC + Ministério dos Direitos Humanos - campanhas de conscientização com mídias sociais e TV. Modo, finalidade e detalhamento exemplares.'
      }
    },
    tecnicas: {
      utilizadas: [
        'Contextualização com documento internacional (Declaração Universal)',
        'Referência à Constituição Federal',
        'Dados estatísticos (Censo Escolar)',
        'Citação de filósofo (Michel Foucault)',
        'Análise crítica de preconceitos sociais',
        'Reconhecimento da diversidade cultural',
        'Proposta de intervenção dupla e integrada',
        'Conectivos sofisticados'
      ],
      repertorioSociocultural: [
        'Declaração Universal dos Direitos Humanos (ONU, 1948)',
        'Constituição Federal de 1988',
        'Censo Escolar - dados sobre educação de surdos',
        'Libras - Língua Brasileira de Sinais',
        'Michel Foucault - teoria sobre marginalização social',
        'Conceito de cultura surda',
        'Educação inclusiva',
        'Ministério da Educação (MEC)',
        'Ministério da Mulher, da Família e dos Direitos Humanos'
      ]
    }
  }
]